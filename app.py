import requests
import json
from flask import Flask,render_template,request,redirect,url_for,flash
import sqlite3 as sql
import platform
from hdbcli import dbapi
app=Flask(__name__)

response = json.loads(requests.get("https://script.googleusercontent.com/macros/echo?user_content_key=7pttRDSlp5fAkCF-VKM0gqdTMgoCU-IbNHnrLWGQCIy3MbDQO0eKHahRXBd2Tghwc8ZxL2zT0sa17uvRYRME0mfbyT-IAqDvm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF3dg1X5Je7zv-VxoqCao4E07gnnj6whz5miIfWD5Rp5225DnTGX7XWr87-fAG8g5AW7feor5yuQHU9coHoM3d_Vrb4KNICxRA&lib=MfhYknUW7Ner48CFi4mEVDjkSvgWdYUEj").text)
#print(response)
#values = [item['first'] for item in response['data']]
@app.route("/")
#@app.route("/index")
def index():
    con = dbapi.connect(
    address="2a5b9eaa-3a38-42fd-b10f-fc34db808672.hana.trial-us10.hanacloud.ondemand.com",
    port=443,
    user="DBADMIN",
    password="MyHanadb911_")

    #con=sql.connect("db_web.db")
    #con.row_factory=sql.Row
    cur=con.cursor()
    cur.execute("SELECT * FROM CRUD_DB.ACCOUNT ORDER BY ACC_NO;")

    data=cur.fetchall()
    cur.execute("SELECT COUNT(*) FROM CRUD_DB.ACCOUNT;")
    data_count = cur.fetchone()[0]
    data_records = str(data_count)
    
    return render_template("index.html",datas=data,dbrecords=data_records)  

@app.route("/add_data",methods=['POST','GET'])
def add_data():
    for item in response["data"]:
        acc_no1=item["Acc_No"]
        description1=item["Description"]
        acc_type1=item["Acc_Type"]
        category1=item["Category"]    
        #print(acc_no1,description1,acc_type1,category1)  
        con = dbapi.connect(
        address="2a5b9eaa-3a38-42fd-b10f-fc34db808672.hana.trial-us10.hanacloud.ondemand.com",
        port=443,
        user="DBADMIN",
        password="MyHanadb911_")
        cur=con.cursor()
        cur.execute("SELECT ACC_NO FROM CRUD_DB.ACCOUNT WHERE ACC_NO = ?", (acc_no1,))
        data=cur.fetchall()
        if len(data)==0:
           sql = "INSERT INTO CRUD_DB.ACCOUNT(ACC_NO, DESCRIPTION, ACC_TYPE, CATEGORY) VALUES (?,?,?,?)"
           val = (acc_no1,description1,acc_type1,category1)
           cur.execute(sql, val)
           con.commit()
           message3 = "Data Added " + str(acc_no1) + " " + description1
           flash(message3, 'success')
        else:
           message5 = "Data already exist! " + str(acc_no1) + " " + description1
           flash(message5, 'danger')     
    return redirect(url_for("index"))
    #return render_template("add_data.html")

@app.route("/delete_data/<string:acc_no>",methods=['GET'])
def delete_data(productid):
    con = dbapi.connect(
       address="2a5b9eaa-3a38-42fd-b10f-fc34db808672.hana.trial-us10.hanacloud.ondemand.com",
       port=443,
       user="DBADMIN",
       password="MyHanadb911_")
    cur=con.cursor()
    cur.execute("DELETE FROM CRUD_DB.ACCOUNT WHERE ACC_NO=?",(acc_no))
    con.commit()
    flash('Data Deleted','warning')
    return redirect(url_for("index"))

if __name__=='__main__':
    app.secret_key='admin123'
    app.run(debug=True)     