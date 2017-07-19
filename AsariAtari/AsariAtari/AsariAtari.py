from flask import Flask, render_template, request, redirect, url_for, abort, session
import json
import random
from static.data_loader import DataLoader
import pprint
import os

app = Flask(__name__)


def makeData2d(N=25):
    return list(zip(random.sample(range(1, 1000), N),
               random.sample(range(1, 1000), N)))

def makeNdatasets(N=5):
    dd = {}
    for i in range(N):
        dd[i] = makeData2d()
    return dd

def import_asari():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    print(dir_path)
    dataloader = DataLoader(dir_path + "/static/taxa2.json")
    dict = dataloader.to_js_dict(level=100)
    pprint.pprint(dict)
    return dict

@app.route('/')
def index():
    return redirect(url_for('bubbleChart'))


@app.route('/bubbleChart')
def bubbleChart():
    return render_template('bubbleChartScalesAxesAnimationInteractivity.html',
                           data=json.dumps(makeNdatasets()))

@app.route('/network')
def network():
    data = {"nodes": [{"name": "node1", "group": 1},
                      {"name": "node2", "group": 2},
                      {"name": "node3", "group": 2},
                      {"name": "node4", "group": 3}],
            "links": [{"source": 2, "target": 1, "weight": 1},
                      {"source": 0, "target": 2, "weight": 3}]}

    return render_template('network_graph.html', data=json.dumps(data))


@app.route('/bubbleChart2')
def bubbleChart2():
    return render_template('notSoFancyBubbleChart.html', data=json.dumps(import_asari()))

if __name__ == '__main__':
    app.run()
