from flask import Flask, render_template

app = Flask(
    __name__,
    template_folder="template",
    static_folder="Static"
)


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    # debug=True reinicia o servidor sozinho quando você salva um arquivo
    # host="0.0.0.0" permite acessar de outros dispositivos na mesma rede Wi-Fi
    app.run(debug=True, host="0.0.0.0")
 