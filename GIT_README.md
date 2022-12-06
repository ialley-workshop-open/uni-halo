# Git管理同步配置

#### 同时推送Gitee和Github
找到项目目录下的`.git`文件夹，打开`config`文件，修改相关代码：
原始代码：
```bash
 [remote "origin"]
	url = https://gitee.com/ialley-workshop-open/uni-halo.git
	fetch = +refs/heads/*:refs/remotes/origin/*
``` 
修改后的代码：
```bash
[remote "github"]
	url = https://github.com/ialley-workshop-open/uni-halo.git
	fetch = +refs/heads/*:refs/remotes/github/*
[remote "gitee"]
	url = https://gitee.com/ialley-workshop-open/uni-halo.git
	fetch = +refs/heads/*:refs/remotes/gitee/*
``` 