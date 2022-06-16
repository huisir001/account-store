#define MyAppName "Account Store"
#define MyAppVersion "1.2.0"
#define MyAppPublisher "HuiSir"
#define MyAppURL "http://code.zuifengyun.com/accountstore"
#define MyAppExeName "AccountStore.exe"

[Setup]
AppId={{315B94F0-C5F6-4992-8A89-5269A4A3F137}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DisableProgramGroupPage=yes
LicenseFile=G:\�ҵ���Ŀ\account-store\install-license.txt
OutputDir=G:\�ҵ���Ŀ\account-store\output
OutputBaseFilename=AccountStore-1.2.0-win-x64x32-installer
SetupIconFile=G:\�ҵ���Ŀ\account-store\public\favicon.ico
Compression=lzma
SolidCompression=yes

[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkablealone
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "G:\�ҵ���Ŀ\account-store\output\AccountStore-win32-x64\AccountStore.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "G:\�ҵ���Ŀ\account-store\output\AccountStore-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; ע��: ��Ҫ���κι���ϵͳ�ļ���ʹ�á�Flags: ignoreversion��

[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent