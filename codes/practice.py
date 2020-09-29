import OpenDartReader

api_key = '5aa3e0c23b496f031039715838bb53d99a9c99ae'
dart = OpenDartReader(api_key)

# == 1. 공시정보 검색 ==
# 삼성전자의 정기보고서('A') 2019년
dart.list('005930', kind='A', start='2018-01-01', end='2020-12-31')

# 삼성전자의 모든 공시 리스트 (1999년 ~ 현재)
print(dart.company_by_name('삼성전자') )

