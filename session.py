import json
from urllib.parse import parse_qs

import utils


def handleGetSession(environ, start_response):
    c = utils.getCursor()
    o = parse_qs(environ['QUERY_STRING'])
    if "sessionId" in o:
        c.execute("select * from sessions where id = ?", [o['sessionId'][0]])
    else:
        c.execute("select * from sessions")
    sessions = c.fetchall()

    user = environ['user']
    sessionDtos = [dict(x) for x in sessions]
    for x in sessionDtos:
        x['missionNamesList'] = x['missionNames'].split(",")
        if user is not None:
            if user.permissionLevel >= 2:
                x['allowedToEdit'] = True

    start_response("200 OK", [])
    return [json.dumps(sessionDtos).encode()]
