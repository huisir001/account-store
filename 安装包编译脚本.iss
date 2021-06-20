#define MyAppName "Account Store"
#define MyAppVersion "1.0"
#define MyAppPublisher "HuiSir"
#define MyAppURL "http://www.zuifengyun.com/"
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
LicenseFile=H:\工作项目\个人\账号仓库桌面软件\account-store\install-license.txt
OutputDir=E:\此电脑\桌面
OutputBaseFilename=AccountStore
SetupIconFile=H:\工作项目\个人\账号仓库桌面软件\account-store\public\favicon.ico
Compression=lzma
SolidCompression=yes

[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 0,6.1
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "H:\工作项目\个人\账号仓库桌面软件\account-store\output\AccountStore-win32-x64\AccountStore.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "H:\工作项目\个人\账号仓库桌面软件\account-store\output\AccountStore-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; 注锟斤拷: 锟斤拷要锟斤拷锟轿何癸拷锟斤拷系统锟侥硷拷锟斤拷使锟矫★拷Flags: ignoreversion锟斤拷

[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

