## 特色
* 数据加密存储（根据本机MAC地址+私钥双重加密）
* 数据本地存储，避免云端安全问题
* 每次进入软件都会生成唯一操作token，每次数据读写都需验证token

## 功能
* 系统配置
* 操作日志实时展示
* 错误日志实时记录
* 数据库手动备份
* 数据库实时备份（可配置启动/关闭时自动备份）
* 进入软件需要总密码+自定义问题双重验证
* 丢失总密码无法进入软件（只能）

## 系统配置
* 数据备份路径
* 修改全局密码(退出登陆)
* 自动备份时机：启动时/关闭时

## 忘记总密码或自定义问题怎么办？
 
忘记其一无法进入，需要重设两者。重设方法：

1. 在初始页面点击【重设总密码】
2. 若数据库中有2条以上的账户数据，需要输入其中随机2条账号的密码，输入正确然后进行重设总密码和自定义问题
3. 若数据库中只有1条或2条账户数据，需要输入全部账户的密码，输入正确之后进行重设总密码和自定义问题
4. 若数据库中没有数据，则可以直接重设
5. 若重设时所有密码都验证失败，则无法重设，只能点击【清空数据库】然后再重设（清空数据库不会清除备份的数据文件，若有机会想起来之前的总密码的话，还是可以将备份的数据文件覆盖软件目录中的数据文件，然后重启软件再次进入或再次重设总密码）