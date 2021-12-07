## 特色
* 数据加密存储（HuiSir独创加密算法加密）
* 数据本地存储，避免云端安全问题
* 每次进入软件都会生成唯一操作token，每次数据读写都需验证token
* 软件安装时可设置加密私钥，数据更安全
* 软件运行有登录超时限制，默认超时时间5分钟。超时后须重新登录。
* 目前只自测了window系统，运行正常。其他操作系统应该会有问题。

## 功能
* 系统配置
* 操作日志实时展示
* 错误日志实时记录
* 数据库手动备份
* 数据库实时备份（可配置启动/关闭时自动备份）
* 进入软件需要总密码+自定义问题双重验证
* 丢失总密码无法进入软件

## 系统配置
* 数据备份路径
* 修改全局密码(退出登陆)
* 自动备份时机：启动时/关闭时

## 忘记总密码或自定义问题怎么办？
 
忘记其一无法进入，需要重设两者。重设方法：

1. 在初始页面点击【忘记密码】
2. 若数据库中有2条及以上的账户数据，需要输入其中随机2条的账号和密码，输入正确然后进行重设总密码和自定义问题
3. 若数据库中只有1条账户数据，需要输入其账号和密码，输入正确之后进行重设总密码和自定义问题
4. 若数据库中没有数据，则可以直接重设
5. 若重设时所有密码都验证失败，则无法重设，只能点击【软件重置】对数据库进行清空，这时会清除所有数据（软件重置不会清除备份的数据文件，若想起总密码的话，还是可以恢复数据）

## 软件登录注意
1. 初次安装需要设置加密私钥，用于加密账号信息。
2. 加密私钥会保存到注册表中，一台电脑只能设置一次私钥，请备份好私钥。
3. 重装系统或在其他电脑上安装软件，在软件安装时需提供先前一致的私钥才能在登陆后对先前备份的数据文件进行恢复，否则若要手动恢复重装软件前备份的数据时将出现不可预知的问题。

## NPM脚本说明
1. 第一次执行打包脚本时要安装electron，下载有点困难，需要执行如下命令修改下载源
```bash
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
```

## 备份恢复(设置选项页)
1. 备份恢复会完全清空现有数据，包括软件的总密码和验证问题答案以及所有配置项和操作记录。所以备份恢复一般为电脑重装系统或更换电脑后使用。
2. 若当前存在账户数据，则可通过【导出表格】对现有账户数据进行导出，导出表格为csv文件。
3. 支持导入csv，csv需与导出的csv文件格式匹配方能导入成功，否则将产生不可预知错误。