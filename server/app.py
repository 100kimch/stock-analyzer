from flask import Flask, request, jsonify
from flask_cors import CORS
import OpenDartReader
import json
import pandas as pd

api_key = '5aa3e0c23b496f031039715838bb53d99a9c99ae'
dart = OpenDartReader(api_key)
app = Flask(__name__)
CORS(app)
# CORS(app, resources={r'*': {'origins': 'https://localhost:5000'}})

corp_all = pd.DataFrame(
    dart.corp_codes)


@app.route('/')
def index():
    return 'Hello Flask'


@app.route('/info')
def info():
    return 'Info'


@app.route('/corp/codes', methods=['GET', 'POST'])
def corp_codes():
    form = request.get_json()

    if form and 'corp_name' in form:
        ret = dart.company_by_name(form['corp_name'])
        print("ret: ", form['corp_name'], ret)
        ret = json.dumps(ret)
    else:
        ret = corp_all.iloc[:10].to_json(orient='records')
    print(json.loads(ret))
    return ret


@app.route('/corp/finstate', methods=['GET', 'POST'])
def corp_finstate():
    ret = []
    form = request.get_json()
    print("request.form: ", form)

    companies = form['companies'] or ['005930']
    years = form['years'] or [2018]

    print("companies: ", companies)
    # print("companies: {:d}, years: {:d}" % (len(companies), len(years)))

    # print("test: ", dart.finstate('삼성전자', 2018))
    # print("test2: ", dart.finstate('현대산업', 2019))
    for company in companies:
        for year in years:
            try:
                print('corp_code: ', company['corp_code'])
                # print('corp: ', company['corp_name'],
                #       company['corp_code'], dart.company(company['corp_code']))
                # print('test_corp: ', dart.finstate(
                #     company['corp_code'], 2018))
                ret.extend(dart.finstate(
                    company['corp_code'], year))
                print("shape: ", ret)
            except Exception as e:
                print("skipped: ", company, year, e)
    print("stored:", ret.shape)
    return ret.to_json(orient='records')

    # ret = json.loads(ret.to_json(orient='records'))
    # return jsonify(ret)
