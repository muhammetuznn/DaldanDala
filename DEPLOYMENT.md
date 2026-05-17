# Otomatik Deploy

Bu proje `main` veya `master` branch'ine push gelince GitHub Actions ile build alir ve VPS'e rsync ile yollar.

## GitHub Secrets

Repo ayarlarinda `Settings > Secrets and variables > Actions` altina sunlari ekle:

- `VPS_SSH_KEY`: VPS'e baglanacak private SSH key
- `VPS_HOST`: VPS IP veya domain
- `VPS_USER`: SSH kullanicisi
- `VPS_APP_PATH`: VPS'te uygulamanin duracagi klasor, ornek `/var/www/daldandala`

Opsiyonel:

- `VPS_SSH_PORT`: SSH portu, bos kalirsa `22`
- `VPS_SYSTEMD_UNIT`: systemd servis adi, bos kalirsa `daldandala`

## VPS'te Bir Kerelik Servis Kurulumu

Ilk deploy dosyalari VPS'e attiktan sonra servisi bir kez kur:

```bash
sudo cp /var/www/daldandala/deploy/daldandala.service.example /etc/systemd/system/daldandala.service
sudo nano /etc/systemd/system/daldandala.service
```

`WorkingDirectory` degerini `VPS_APP_PATH` ile ayni yap. Port veya host degisecekse `Environment` satirlarini da duzenle.

Sonra:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now daldandala
sudo systemctl status daldandala
```

Nginx kullaniyorsan siteyi `127.0.0.1:4173` adresine reverse proxy et.
