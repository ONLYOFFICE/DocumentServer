#!/usr/bin/python -u
#
# Processing of the queries results
#
import sys
import index
import time
import traceback
import string

if index.openMySQL(verbose = 0) < 0:
    print "Failed to connect to the MySQL database"
    sys.exit(1)

DB = index.DB

def getTopQueriesDB(base = "Queries", number = 50):
    global DB

    try:
        import os
	os.mkdir("searches")
    except:
        pass
    
    date = time.strftime("%Y%m%d")
    f = open("searches/%s-%s.xml" % (base, date), "w")
    c = DB.cursor()
    try:
        ret = c.execute("""select sum(Count) from %s""" % (base))
	row = c.fetchone()
	total = int(row[0])
        ret = c.execute("""select count(*) from %s""" % (base))
	row = c.fetchone()
	uniq = int(row[0])
        ret = c.execute(
           """select * from %s ORDER BY Count DESC LIMIT %d""" % (base, number))
	i = 0;
	f.write("<queries total='%d' uniq='%d' nr='%d' date='%s'>\n" % (
	      total, uniq, number, date))
	while i < ret:
	    row = c.fetchone()
	    f.write("  <query count='%d'>%s</query>\n" % (int(row[2]), row[1]))
	    i = i + 1
	f.write("</queries>\n")
    except:
        print "getTopQueries %s %d failed\n" % (base, number)
	print sys.exc_type, sys.exc_value
	return -1
    f.close()

def getTopQueries(number = 50):
    return getTopQueriesDB(base = "Queries", number = number)

def getAllTopQueries(number = 50):
    return getTopQueriesDB(base = "AllQueries", number = number)

def increaseTotalCount(Value, count):
    global DB

    c = DB.cursor()
    try:
        ret = c.execute("""select ID,Count from AllQueries where Value='%s'""" %
	                (Value))
	row = c.fetchone()
	id = row[0]
	cnt = int(row[1]) + count
	ret = c.execute("""UPDATE AllQueries SET Count = %d where ID = %d""" %
	                (cnt, id))
    except:
        ret = c.execute(
	"""INSERT INTO AllQueries (Value, Count) VALUES ('%s', %d)""" %
	                (Value, count))
    

def checkString(str):
    if string.find(str, "'") != -1 or \
       string.find(str, '"') != -1 or \
       string.find(str, "\\") != -1 or \
       string.find(str, " ") != -1 or \
       string.find(str, "\t") != -1 or \
       string.find(str, "\n") != -1 or \
       string.find(str, "\r") != -1:
        return 0
    return 1
def addCounts(frmtable):
    global DB

    i = 0
    c = DB.cursor()
    entries=[]
    try:
        ret = c.execute("""select Value,Count from %s""" % (frmtable))
	while i < ret:
	    i = i + 1
	    row = c.fetchone()
	    if checkString(row[0]):
		entries.append((row[0], int(row[1])))
	    else:
		entries.append((None, int(row[1])))
	
	for row in entries:
	    if row[0] != None:
		increaseTotalCount(row[0], row[1])
    except:
        print "addCounts %s failed" % (frmtable)
	print sys.exc_type, sys.exc_value
	traceback.print_exc(file=sys.stdout)
        
    try:
	c.execute("""DELETE from %s""" % (frmtable))
    except:
	pass


    
getTopQueries()
addCounts('Queries')
getAllTopQueries()
