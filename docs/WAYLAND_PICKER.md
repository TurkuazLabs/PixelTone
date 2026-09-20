# 📄 Dosya Yolu: pixeltone/docs/WAYLAND_PICKER.md
# 📌 Amac: Wayland ortamlarinda PixelTone picker davranisi ve fallback stratejisini tanimlamak
# 📌 Docs - Markdown
# Version: 0.4.0
# Aciklama: Canli overlay destegi ile XDG Desktop Portal PickColor fallback sinirlarini ve gecis kurallarini tanimlar

Bagimli Oldugu Katman: Tool

# Wayland Picker Stratejisi

## Hedef

PixelTone v0.4.0 Picker Experience, Windows, macOS ve izin veren Linux masaustu ortamlarinda canli overlay uzerinden cursor konumunu izler, 9x9 buyutec gosterir ve secilen rengi panoya kopyalar.

Wayland compositorleri global cursor koordinati veya dogrudan ekran yakalama erisimini guvenlik nedeniyle kisitlayabilir. Bu nedenle Wayland destegi iki seviyeli ele alinir.

## Seviye 1 - Canli Overlay

Mevcut capture Tool global cursor koordinatini ve ekran goruntusunu okuyabiliyorsa standart Picker Experience kullanilir:

1. Global shortcut picker penceresini acar.
2. Picker cursorun bulundugu monitor boyutuna tasinir.
3. Capture Service periyodik olarak cursor altindaki rengi ve 9x9 cevresini okur.
4. Sol tik secimi tamamlar.
5. H tusu HEX, R tusu RGB kopyalama modunu secer.
6. Esc picker penceresini kapatir.

Bu akis compositor izin verdigi surece kullanilir.

## Seviye 2 - XDG Desktop Portal PickColor

Global cursor veya ekran capture erisimi engellenirse sonraki Wayland adaptoru XDG Desktop Portal Screenshot arayuzundeki PickColor metodunu kullanmalidir.

Portal akisi:

1. PixelTone portal uzerinden kullanicidan renk secimi ister.
2. Compositor kendi guvenli renk secim arayuzunu gosterir.
3. Portal sonucu sRGB uzayinda 0.0 ile 1.0 arasinda RGB degerleri olarak doner.
4. Tool katmani portal sonucunu PixelTone HEX/RGB modeline cevirir.
5. Service secilen rengi normal picker sonucu gibi ana pencereye aktarir ve panoya yazar.

## Sinir

Portal PickColor tek secim odaklidir. Standart canli 9x9 buyutec deneyiminin birebir karsiligi degildir. Bu nedenle portal yolu fallback olarak kullanilir; canli overlay destekleniyorsa tercih edilen yol degismez.

## Mimari Kural

Wayland portal entegrasyonu eklendiginde D-Bus veya portal istemci kodu Controller icine yazilmayacaktir.

Akis:

`Controller -> Service -> Tool`

- Controller sadece picker istegini Service katmanina aktarir.
- Service canli capture ile portal fallback arasindaki karari verir.
- Tool XDG Desktop Portal ile iletisimi gerceklestirir.
- View sadece sonuc ve kullanici durumunu gosterir.
- Language hata ve durum mesajlarini tutar.

## v0.4.0 Durumu

v0.4.0 ile canli overlay altyapisi ve Wayland portal fallback stratejisi tanimlanmistir. Portal PickColor adaptorunun kendisi bu surumde uygulanmis olarak kabul edilmez; compositor nedeniyle canli capture kullanilamayan ortamlarda sonraki platform adaptoru olarak planlanir.
