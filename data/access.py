import win32com.client
import os

basedir = os.path.dirname(__file__) 

def fetch(db, table, columns):
	conn = win32com.client.Dispatch('ADODB.Connection')
	conn.ConnectionString = 'PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=%s;' % os.path.join(basedir, db)
	conn.Open()
	rs = win32com.client.Dispatch('ADODB.Recordset')
	sql = "SELECT %s FROM %s" % (",".join(columns), table) 
	print sql
	rs.Open(sql, conn, 1, 3)
	result = []
	while not rs.EOF:
		obj = {}
		for col in columns:
			obj[col] = rs.Fields(col).Value
		rs.MoveNext()
		result.append(obj)
	rs.Close()
	conn.Close()
	return result


