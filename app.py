from flask import Flask, render_template, request, redirect, url_for, session, g
import json
import time
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

def read_json_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_json_file(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

@app.before_request
def before_request():
    g.lang = session.get('lang', 'en')
    all_locales = read_json_file('data/locales.json')
    g.locale = all_locales.get(g.lang, all_locales['en'])
    # Get theme from URL (e.g., ?theme=minimal), default to 'aurora'
    g.theme = request.args.get('theme', 'aurora')

@app.route('/change_lang/<lang>')
def change_lang(lang):
    session['lang'] = lang
    # Keep the current theme when changing language
    theme = request.args.get('theme', 'aurora')
    # Redirect back to the previous page, preserving the theme
    referrer = request.referrer.split('?')[0] if request.referrer else url_for('login_page')
    return redirect(f"{referrer}?theme={theme}")

@app.route('/')
def login_page():
    return render_template('login.html', theme=g.theme)

@app.route('/login', methods=['POST'])
def handle_login():
    session['user_type'] = request.form['user_type']
    theme = request.args.get('theme', 'aurora')
    return redirect(url_for('dashboard', theme=theme))

@app.route('/dashboard')
def dashboard():
    if 'user_type' not in session:
        return redirect(url_for('login_page', theme=g.theme))
    
    user_type = session['user_type']
    all_services = read_json_file('data/services.json')
    user_services = all_services.get(user_type, [])
    
    return render_template('dashboard.html', services=user_services, theme=g.theme)

# Baaki ke routes (grievance, track, logout, etc.) bhi theme pass karenge
@app.route('/grievance')
def grievance_page():
    if 'user_type' not in session: return redirect(url_for('login_page', theme=g.theme))
    return render_template('grievance.html', theme=g.theme)

@app.route('/submit_grievance', methods=['POST'])
def submit_grievance():
    new_grievance = {
        'name': request.form['name'], 'department': request.form['department'],
        'complaint': request.form['complaint'], 'status': 'Pending',
        'ticket_id': f"TG-{int(time.time())}"
    }
    grievances = read_json_file('data/grievances.json')
    grievances.append(new_grievance)
    write_json_file('data/grievances.json', grievances)
    return redirect(url_for('grievance_status', ticket_id=new_grievance['ticket_id'], theme=g.theme))

@app.route('/track')
def track_page():
    if 'user_type' not in session: return redirect(url_for('login_page', theme=g.theme))
    return render_template('track_grievance.html', theme=g.theme)

@app.route('/check_status', methods=['POST'])
def check_status():
    search_id = request.form['ticket_id']
    return redirect(url_for('grievance_status', ticket_id=search_id, theme=g.theme))

@app.route('/status/<ticket_id>')
def grievance_status(ticket_id):
    grievances = read_json_file('data/grievances.json')
    found_grievance = next((g for g in grievances if g['ticket_id'] == ticket_id), None)
    return render_template('grievance_status.html', grievance=found_grievance, theme=g.theme)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login_page', theme=g.theme))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
