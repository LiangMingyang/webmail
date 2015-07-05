����api�ӿ�
====
-------------------

[TOC]

## �û���������

###��½

- ����:`POST`
- ·��: `/user/login`
- ���Ͳ���:
	- username: `String` �û���
	- password: `String` �û�����
- ���ؽ��:
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ������Ϣ

###�ǳ�

- ����:`GET`
- ·��: `/user/logout`
- ���Ͳ���: **��**
- ���ؽ��:
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ

###�õ��û���Ϣ
�õ��Լ�����Ϣ
- ����:`GET`
- ·��: `/user/info`
- ���Ͳ���:
	- username: `String` �û���
	- password: `String` �û�����
- ���ؽ��:
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- user: `Object` 
		- username: `String` �û����û���
		- id: `Number` �û���id
		- privilege: `String` ö�����ͣ���dispatcher,consumer,auditor,admin�е�һ�� *ע�⣺��һ�������µģ���½ˢ��*

##�����û�

###�õ������û�
�õ������û���������Ϣ
- ����:`GET`
- ·��: `/user/all`
- ���ؽ��:
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- users: `Array` ÿһ���һ���û�instance���μ�`/user/info`

###�ı��û����
�����ı��û������ **����**

###�����û���Ϣ

- ����:`POST`
- ·��: `/user/update`
- ���Ͳ���:
	- userId: `String` Ҫ���µ��û���id
	- password: `String` `Opt` �û�����
	- privilege: `String` `Opt` ö������
- ���ؽ��:
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- user: `Object` �û�instance

###����һ���û�

###ɾ���û�

##�ռ���

###�鿴�ʼ��б�

�����������Լ���ݵ��ʼ����������û�ͬ����øýӿ�

- ����: `POST`
- ·��: `/inbox/list`
- �����ֶ�
	- offset: `Number` `Opt`ƫ����*���ڷ�ҳ��Ĭ��Ϊ0* 
	- limit: `Number` `Opt`��෵�ض���Ԫ�أ�*���ڷ�ҳ��Ĭ��Ϊ20*
	- tags: `Array` `Opt` ���������ı�ǩ���ƣ�*Ĭ�ϲ�����*
- ���ؽ��
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- mails: `Array`���ظ��ʼ�ʵ������
	- count: `Number` �����������ʼ����ж��ٸ�

###�鿴�ʼ�ϸ��

�����������Լ���ݵ��ʼ�ϸ��

- ����: `POST`
- ·��: `/inbox/detail`
- �����ֶ�
	- mail: `Number` �鿴���ʼ���id
- ���ؽ��
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- mail: `Object`���ظ��ʼ�ʵ��



###�ַ��ʼ�

��Ҫ���û�Ϊ����Ա��ַ���Ա

- ����: `POST`
- ·��: `/inbox/detail`
- �����ֶ�
	- mail: `Number` �鿴���ʼ���id
	- consumers: `Array` Ҫ�ַ����Ĵ�����Ա���飬ÿһ��Ϊid
- ���ؽ��
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- mail: `Object`���ظ��ʼ�ʵ��
####��

``` javascript
{
	mail :����
	consumers : [1,2,3]
}
```



###�ظ��ʼ�

��Ҫ���û�Ϊ����Ա������Ա

- ����:`POST`
- ·��: `/inbox/handle`
- ���Ͳ���:
	- title: `String` �ظ����ʼ��ı���
	- urgent: `Number` 1/0
	- auditorId: `Number` `Opt` ѡ�������Ա
	- html: `String` ���͵�html
	- text: `String` ���͵��ʼ�����
	- to: `String` ���͵��ʼ���ַ����ʽӦΪ`name<add@domain.com>,...`
	- replyToId: `Number` ��Ϊ�˴�����һ���ʼ���inbox���ʼ�Id
- ���ؽ��:
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ

###����

��Ҫ���û�Ϊ����Ա������Ա
		
- ����:`POST`
- ·��: `/inbox/return`
- ���Ͳ���:
	- mail: `Number` ��ʾ�ʼ���id
- ���ؽ��:
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- mail: `Object`���ظ��ʼ�ʵ��

###ֱ������ʼ�

��Ҫ���û�Ϊ����Ա������Ա

- ����:`POST`
- ·��: `/inbox/return`
- ���Ͳ���:
	- mail: `Number` ��ʾ�ʼ���id
- ���ؽ��:
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- mail: `Object`���ظ��ʼ�ʵ��

###����(����)�ʼ�

��Ҫ���û�Ϊ����Ա��ַ���Ա

- ����:`POST`
- ·��: `/inbox/update`
- ���Ͳ���:
	- mail: `Number` ��ʾ�ʼ���id
	- deadline: `Date` ����ʱ��
	- tags: `Array` ÿһ��Ϊtag��id
- ���ؽ��:
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- mail: `Object`���ظ��ʼ�ʵ��

##������

###�鿴�ʼ��б�

�����������Լ���ݵ��ʼ����������û�ͬ����øýӿ�

- ����: `POST`
- ·��: `/outbox/list`
- �����ֶ�
	- offset: `Number` `Opt`ƫ����*���ڷ�ҳ��Ĭ��Ϊ0* 
	- limit: `Number` `Opt`��෵�ض���Ԫ�أ�*���ڷ�ҳ��Ĭ��Ϊ20*
- ���ؽ��
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- mails: `Array`���ظ��ʼ�ʵ������
	- count: `Number` �����������ʼ����ж��ٸ�

###�鿴�ʼ�ϸ��

�����������Լ���ݵ��ʼ�ϸ��

- ����: `POST`
- ·��: `/outbox/detail`
- �����ֶ�
	- mail: `Number` �鿴���ʼ���id
- ���ؽ��
	- status: `Number` 1/0 *1��ʾ�ɹ���0��ʾʧ��*
	- msg: `String` ���ؾ�����Ϣ��Ϣ
	- mail: `Object`���ظ��ʼ�ʵ��


