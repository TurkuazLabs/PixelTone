// # 📄 Dosya Yolu: pixeltone/frontend/controllers/picker_controller.js
// # 📌 Amac: Picker overlay input olaylarini alip PickerService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 0.4.0
// # Aciklama: Pointer, klavye, visibility ve aktivasyon olaylarini Service katmanina yonlendirir
//
// Bagimli Oldugu Katman: Controller

import { APP_CONFIG } from "../config/app_config.js";
import { TR_LABELS } from "../language/tr.js";
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
  const message =
    typeof error === "string" && error.trim()
      ? error
      : error?.message || TR_LABELS.status.pickerSampleFailed;

  pickerView.renderError(message);
}

async function boot() {
  pickerView.initializeLabels(APP_CONFIG.picker.shortcut);
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

  await pickerService.onActivation(() => {
    pickerService.startSession(renderSample, renderError);
  });
}

void boot();
