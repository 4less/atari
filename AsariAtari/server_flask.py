#!flask/bin/python
from flask import Flask, render_template, request, redirect, url_for, abort, session
from werkzeug.utils import secure_filename
import os
import sys
import json
import random
import pandas as pd

UPLOAD_FOLDER = '/data/'
ALLOWED_EXTENSIONS = set(['csv'])

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'some_really_long_random_string_here'
app.config['STORMPATH_API_KEY_FILE'] = 'apiKey.properties'
app.config['STORMPATH_APPLICATION'] = 'flaskr'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def makeData2d(N=25):
    return zip(random.sample(range(1, 1000), N),
               random.sample(range(1, 1000), N))

def makeNdatasets(N=5):
    dd = {}
    for i in range(N):
        dd[i] = makeData2d()
    return dd

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
    return render_template('notSoFancyBubbleChart.html', data=json.dumps(""))


########## experimental ############
#def allowed_file(filename):
#    return '.' in filename and \
#           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
#
#@app.route('/', methods=['GET', 'POST'])
#def upload_file():
#    if request.method == 'POST':
#        # check if the post request has the file part
#        if 'file' not in request.files:
#            flash('No file part')
#            return redirect(request.url)
#        file = request.files['file']
#        # if user does not select file, browser also
#        # submit a empty part without filename
#        if file.filename == '':
#            flash('No selected file')
#            return redirect(request.url)
#        if file and allowed_file(file.filename):
#            filename = secure_filename(file.filename)
#            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#            return redirect(url_for('uploaded_file',
#                                    filename=filename))
#    return '''
#    <!doctype html>
#    <title>Upload new File</title>
#    <h1>Upload new File</h1>
#    <form method=post enctype=multipart/form-data>
#      <p><input type=file name=file>
#         <input type=submit value=Upload>
#    </form>
#    '''

#@app.route('/upload')
#def upload_file():
#   return render_template('upload.html')
	
@app.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      filename = secure_filename(f.filename)
      
      with open('output.logs', 'w') as log:
            log.write("test\n")
            log.write(str(f.filename) + "\n")
            log.write("f filename\n")

            basedir = os.path.abspath(os.path.dirname(__file__))
            log.write(basedir + "\n")
            path = basedir + os.path.join(app.config['UPLOAD_FOLDER'], filename)
            log.write(path)
            f.save(path)
            data = parse_csv(path)
            return render_template('notSoFancyBubbleChart.html', data=json.dumps(data))

      parse_csv(path)
      
      return render_template('notSoFancyBubbleChart.html', data="")
      #return 'file uploaded successfully'



def parse_csv(filename, seperator=','):
    dataframe = pd.DataFrame()
    try:
        with open(filename, 'r') as csv_file:
            dataframe = pd.read_csv(csv_file, sep=seperator)
            dataframe.dropna(inplace=True);
    except IOError as e:
        print (e)
    return dataframe.to_dict('list')


if __name__ == '__main__':
    app.run(debug=True)
