	IPLocator �ĵ�
		-- http://spadger.blog.com.cn
    ��ˮľ���濴��������PythonдIP���ݿ�Ĳ�ѯ����������Դ
����ȴһֱ���Բ�ͨ��������������IP���ݿ��ʽ�ĵ��������ĵ�˵
����д����󲿷ִ��룬��IPLocator.py��ʵ����IP��ַ�Ĳ�ѯ��д
�������δ�������Ƿֱ������C���Ժ�C++ʵ��.

��Ҫ�ļ��嵥:
1.IPLocator.py
  IP���ݿ��ѯPython����ʵ��
2.IPLocator.h & IPLocator.c
  IP���ݿ��ѯC����ʵ��
3.IPLocator.hpp & IPLocator.cpp
  IP���ݿ��ѯC++����ʵ��
4.QQWry.dat
  ɺ�����IP���ݿ� 20061105 ��¼������50424��
5.����IP���ݿ��ʽ���.htm
  ����LumaQQ�������ĵ�
6.readme.txt
  ���ĵ�

�÷�����:
1.Python
    IPL = IPLocator( "QQWry.dat" )
    address = IPL.getIpAddr( IPL.str2ip("202.200.225.52") )
  ����ο�IPLocator.py�е�Demo
2.C����
  int get_ip_addr(unsigned int ip, unsigned char *addr, int len, 
	unsigned int *range_start_ip, unsigned int *range_end_ip);
  ip: ����ѯ��IP
  addr: ��Ž���Ļ�����
  len: ��Ž���Ļ���������
  range_start_ip: IP����IP�ε���ʼ,�������Ҫ��ΪNULL
  range_start_ip: IP����IP�εĽ���,�������Ҫ��ΪNULL
3.C++
  IPLocator ipl("QQWry.dat");
  string ip("202.200.225.52");
  cout << ipl.getVersion() << endl 
       << ipl.getIpAddr(ip) << endl
       << ipl.getIpRange(ip) << endl;

    ���������Ҫ������ͬ���ļ�������Ĺ��̼��ɣ�����ϸ����ֱ��
�Ķ�Դ����
    ��������� ZLib ���֤�������κ��˿������κ�Ŀ��ʹ�ñ�����
�ɴ���ɵ�һ�к����ʹ���߳е������������߲��е��κ���ʽ�ĵ���
�����Σ����֤ϸ�����Դ�ļ������������ʹ�ñ�������Ĭ�Ͻ���
ZLib ���֤��
    �κ���������飬Bug���棬Job Offer�������Money���� ��ֱ��
���ҵ�Blog���Ի��� mailto:echo.xjtu@gmail.com
    Good Luck!
                                spadger <echo.xjtu@gmail.com>
                                2008-2-20 22:49 �ڼ���