// # 📄 Dosya Yolu: pixeltone/frontend/controllers/picker_controller.js
// # 📌 Amac: Picker overlay input olaylarini alip PickerService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.2.0
// # Aciklama: Pointer, klavye, visibility ve aktivasyon olaylarini Service katmanina yonlendirir
//
// Bagimli Oldugu Katman: Controller

import { APP_CONFIG } from "../config/app_config.js";
import { languageService } from "../services/language_service.js";
import { preferenceService } from "../services/preference_service.js";
import { pickerService } from "../services/picker_service.js";
import { pickerView } from "../views/picker_view.js";

function renderSample(sample) {
  pickerView.renderCapture(
    sample.capture,
    sample.colorInfo,
    sample.copyFormat,
  );
}

function renderError(error) {
  pickerView.renderError(error, languageService.getLabels().status.pickerSampleFailed);
}

async function boot() {
  await preferenceService.initialize();
  pickerView.initializeLabels(languageService.getLabels(), APP_CONFIG.defaults.settings.pickerShortcut);
  pickerView.bindPointerMove((event) => {
    pickerView.positionCard(event.clientX, event.clientY);
  });
  pickerView.bindPointerDown((event) => {
    pickerService.handlePointerButton(event.button);
  });
  pickerView.bindKeyDown((event) => {
    pickerService.handleKey(event.code);
  });
  pickerView.bindVisibilityChange(() => {
    pickerService.setVisibility(pickerView.isVisible());
  });

  await pickerService.onActivation((options) => {
    pickerService.startSession(options, renderSample, renderError);
  });
}

void boot();
