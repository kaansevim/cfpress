; <?php exit; // DO NOT DELETE?>
; DO NOT DELETE THE ABOVE LINE!!!
; Doing so will expose this configuration file through your web site!
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;
; OJS yapılandırma dosyası — dergi.cf.org.tr için önceden dolduruldu.
; (OJS 3.5.0-5 config.TEMPLATE.inc.php temel alındı)
;
; NOT: Bu dosya bir ŞABLONDUR. Sunucuda kurulum.sh bu dosyadan
; ojs/config/ojs.config.inc.php üretir ve __PLACEHOLDER__ alanlarını
; rastgele değerlerle doldurur. Canlı dosyayı git'e commit ETMEYİN.
;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


;;;;;;;;;;;;;;;;;;;;
; General Settings ;
;;;;;;;;;;;;;;;;;;;;

[general]

; An application-specific key that is required for the app to run
; (kurulum sırasında OJS tarafından otomatik doldurulur)
app_key =

; Set this to On once the system has been installed
; (This is generally done automatically by the installer)
installed = Off

; The canonical URL to the OJS installation (excluding the trailing slash)
base_url = "https://dergi.cf.org.tr"

; Enable strict mode
strict = Off

; Session cookie name
session_cookie_name = OJSSID

; Number of days a session remains valid while idle
session_lifetime = 7

; SameSite configuration for the cookie
session_samesite = Lax

; Site time zone
time_zone = "Europe/Istanbul"

; Short and long date formats
date_format_short = "Y-m-d"
date_format_long = "F j, Y"
datetime_format_short = "Y-m-d h:i A"
datetime_format_long = "F j, Y - h:i A"
time_format = "h:i A"

; Use fopen(...) for URL-based reads
allow_url_fopen = Off

; Base URL override settings (gerek yok; tek alan adı kullanılıyor)

; Generate RESTful URLs using mod_rewrite
restful_urls = Off

; Restrict the list of allowed hosts to prevent HOST header injection.
allowed_hosts = '["dergi.cf.org.tr"]'

; Reverse proxy (Cloudflare + sunucu proxy'si) arkasında gerçek ziyaretçi
; IP'sinin görülebilmesi için açık olmalı
trust_x_forwarded_for = On

; Display a message if there is an upgrade available
show_upgrade_warning = On

enable_minified = On

; Provide a unique site ID and OAI base URL to PKP for statistics
enable_beacon = On

sitewide_privacy_statement = Off

; The number of days a new user has to validate their account
user_validation_period = 28

sandbox = Off


;;;;;;;;;;;;;;;;;;;;;
; Database Settings ;
;;;;;;;;;;;;;;;;;;;;;

[database]

driver = mysqli
host = db
username = ojs
password = __OJS_DB_PASSWORD__
name = ojs

; Enable database debug output (very verbose!)
debug = Off


;;;;;;;;;;;;;;;;;;
; Cache Settings ;
;;;;;;;;;;;;;;;;;;

[cache]

web_cache = Off
web_cache_hours = 1


;;;;;;;;;;;;;;;;;;;;;;;;;
; Localization Settings ;
;;;;;;;;;;;;;;;;;;;;;;;;;

[i18n]

; Default locale (web kurulumunda Türkçe seçebilirsiniz)
locale = en

; Database connection character set
connection_charset = utf8


;;;;;;;;;;;;;;;;;
; File Settings ;
;;;;;;;;;;;;;;;;;

[files]

; Complete path to directory to store uploaded files
; (docker-compose.yml içindeki ojs_files volume'una denk gelir)
files_dir = /var/www/files

; Path to the directory to store public uploaded files
public_files_dir = public

public_user_dir_size = 5000

; Permissions mask for created files and directories
umask = 0022


;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Fileinfo (MIME) Settings ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;

[finfo]
; mime_database_path = /etc/magic.mime


;;;;;;;;;;;;;;;;;;;;;
; Security Settings ;
;;;;;;;;;;;;;;;;;;;;;

[security]

; HTTPS zorlaması Cloudflare'in "Always Use HTTPS" ayarıyla yapılır.
; (Origin'e istekler proxy üzerinden geldiği için burada On yapılırsa
; HTTPS algılama sorunlarında yönlendirme döngüsü oluşabilir.)
force_ssl = Off

force_login_ssl = Off

; Cloudflare/proxy arkasında ziyaretçi IP'si değişken görünebileceğinden
; oturum düşmelerini önlemek için kapalı
session_check_ip = Off

encryption = sha1

session_expire_on_close = Off

remember_me_lifetime = 30

; The unique salt to use for generating password reset hashes
; (kurulum.sh rastgele üretir)
salt = "__OJS_SALT__"

; The unique secret used for encoding and decoding API keys
; (kurulum.sh rastgele üretir)
api_key_secret = "__OJS_API_KEY_SECRET__"

reset_seconds = 7200

allowed_html = "a[href|target|title],em,strong,cite,code,ul,ol,li[class],dl,dt,dd,b,i,u,img[src|alt],sup,sub,br,p"

allowed_title_html = "b,i,u,sup,sub"


;;;;;;;;;;;;;;;;;;
; Email Settings ;
;;;;;;;;;;;;;;;;;;

[email]

; Varsayılan: sendmail. Gerçek e-posta gönderimi için SMTP önerilir —
; aşağıdaki satırları açıp kendi SMTP bilgilerinizi girin (bkz. KURULUM.md).
default = sendmail

sendmail_path = "/usr/sbin/sendmail -bs"

; smtp = On
; smtp_server = mail.example.com
; smtp_port = 587
; smtp_auth = tls
; smtp_username = username
; smtp_password = password

require_validation = Off

validation_timeout = 14


;;;;;;;;;;;;;;;;;;;
; Search Settings ;
;;;;;;;;;;;;;;;;;;;

[search]

min_word_length = 3

results_per_keyword = 500

; PDF içeriği indeksleme (konteynerde pdftotext mevcutsa açılabilir)
; index[application/pdf] = "/usr/bin/pdftotext -enc UTF-8 -nopgbrk %s - | /usr/bin/tr '[:cntrl:]' ' '"


;;;;;;;;;;;;;;;;
; OAI Settings ;
;;;;;;;;;;;;;;;;

[oai]

; Enable OAI front-end to the site
oai = On

; OAI Repository identifier
repository_id = dergi.cf.org.tr

oai_max_records = 100


;;;;;;;;;;;;;;;;;;;;;;
; Interface Settings ;
;;;;;;;;;;;;;;;;;;;;;;

[interface]

items_per_page = 25

page_links = 10


;;;;;;;;;;;;;;;;;;;;
; Captcha Settings ;
;;;;;;;;;;;;;;;;;;;;

[captcha]

recaptcha = off
recaptcha_public_key = your_public_key
recaptcha_private_key = your_private_key
captcha_on_register = on
captcha_on_login = on
recaptcha_enforce_hostname = Off

; ALTCHA — ücretsiz/açık kaynak captcha alternatifi
altcha = off
altcha_hmackey = 'Example key'
altcha_on_register = on
altcha_on_login = on
altcha_on_lost_password = on
altcha_encrypt_number = 10000


;;;;;;;;;;;;;;;;;;;;;
; External Commands ;
;;;;;;;;;;;;;;;;;;;;;

[cli]

tar = /bin/tar

xslt_command = ""


;;;;;;;;;;;;;;;;;;
; Proxy Settings ;
;;;;;;;;;;;;;;;;;;

[proxy]

; http_proxy = ""
; https_proxy = ""


;;;;;;;;;;;;;;;;;;
; Debug Settings ;
;;;;;;;;;;;;;;;;;;

[debug]

show_stacktrace = Off
display_errors = Off
deprecation_warnings = Off
log_web_service_info = Off


;;;;;;;;;;;;;;;;;;;;;;;
; Job Queues Settings ;
;;;;;;;;;;;;;;;;;;;;;;;

[queues]

default_connection = "database"
default_queue = "queue"
job_runner = On
job_runner_max_jobs = 30
job_runner_max_execution_time = 30
job_runner_max_memory = 80
job_runner_cross_request_lock = On
process_jobs_at_task_scheduler = Off
delete_failed_jobs_after = 180


;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Scheduled Task Settings ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;

[schedule]

task_runner = On
task_runner_interval = 60
scheduled_tasks_report_error_only = On


;;;;;;;;;;;;;;;;;;;;;;;;;
; Invitations Settings  ;
;;;;;;;;;;;;;;;;;;;;;;;;;

[invitations]

expiration_days = 3


;;;;;;;;;;;;;;;;;;;;;;;;;
; New Features Settings ;
;;;;;;;;;;;;;;;;;;;;;;;;;

[features]
