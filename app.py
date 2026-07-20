from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__, template_folder="template", static_folder="Static")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/playlist")
def get_playlist():
    try:
        # A API do iTunes é aberta. Sem chaves, sem paywall, sem choro.
        url = "https://itunes.apple.com/search?term=the+weeknd&entity=song&limit=6"
        
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return jsonify({"error": f"A Apple recusou a conexão: {response.text}"}), 400
            
        return jsonify(response.json())

    except Exception as e:
        return jsonify({"error": f"Falha interna no Python: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")