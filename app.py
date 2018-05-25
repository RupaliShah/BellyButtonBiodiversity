import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, desc

from flask import Flask, render_template, jsonify

# Database Setup

engine = create_engine("sqlite:///belly_button_biodiversity.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to the table
Otu = Base.classes.otu
Samples = Base.classes.samples
Samples_Metadata = Base.classes.samples_metadata

# Create our session (link) from Python to the DB
session = Session(engine)
    
app = Flask(__name__)

#create Flask routes 
@app.route("/")
def home():
    return render_template("index.html")

@app.route('/names')
#sreturns list of sample names
def sampleNames():
    sample_names = []
    results = session.query(Samples_Metadata.SAMPLEID)
    for result in results:
        sample_names.append('BB_' + str(result[0]))
    return jsonify(sample_names)     
     
@app.route('/otu')
# returns a list of OTU sample descriptions
def otuDesc():    
    otu_desc = []
    results = session.query(Otu.lowest_taxonomic_unit_found)
    otu_desc = [result[0] for result in results]
    
    return jsonify(otu_desc)

@app.route('/metadata/<sample>')
#returns a json dictionary of sample metadata
def metadata(sample):
     sample_data = {}
     sample_id = sample.split("_")[1]
     results = session.query(Samples_Metadata.AGE, Samples_Metadata.BBTYPE, Samples_Metadata.ETHNICITY,\
                             Samples_Metadata.GENDER, Samples_Metadata.LOCATION, Samples_Metadata.SAMPLEID, ).\
                             filter(Samples_Metadata.SAMPLEID == sample_id).all()
     for result in results:
        sample_data["AGE"] = result[0]
        sample_data["BBTYPE"] = result[1]
        sample_data["ETHNICITY"] = result[2]
        sample_data["GENDER"] = result[3]
        sample_data["LOCATION"] = result[4]
        sample_data["SAMPLEID"] = result[5]
        
     return jsonify(sample_data)

@app.route('/wfreq/<sample>')
#returns an integer value for the weekly washing frequency `WFREQ`
def wfreq(sample):
    sample_id = sample.split("_")[1]
    results = session.query(Samples_Metadata.SAMPLEID, Samples_Metadata.WFREQ).filter(Samples_Metadata.SAMPLEID == sample_id).all()
    for result in results:
        wash_freq = result[1]

    return jsonify(wash_freq)

@app.route('/samples/<sample>')
#Return a list of dictionaries containing sorted lists  for `otu_ids`
#and `sample_values`        
def otusample(sample):  
    query_string = f"SELECT {sample}, otu_id FROM Samples ORDER BY {sample} DESC"
    results = engine.execute(query_string).fetchall()
    sample_values = [result[0] for result in results]  
    otu_ids = [result[1] for result in results]
    df = pd.DataFrame({"otu_ids": otu_ids, "sample_values": sample_values})
    clean_df = df[df['sample_values'] > 0 & df['sample_values'].notnull()]
    otu_and_sample = clean_df.to_dict(orient="list")
    
    return jsonify([otu_and_sample])
    
if __name__ == "__main__":
    app.run(debug=True)