from flask import Flask
from flask_restful import Resource, Api

from gitlabstats import GitLabStats

app = Flask(__name__)
api = Api(app)

api.add_resource(GitLabStats, '/api/gitlabstats')

if __name__ == '__main__':
    app.run(debug=True)