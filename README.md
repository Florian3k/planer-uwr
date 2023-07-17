# planer-uwr

Program planner for University of Wrocław Computer Science degrees.

## Installation

### Scrap courses
```
python planer-uwr-scraping/scrap.py
```

It may take a while...

### Launch app
Provide `docker-compose.yml` environment variables.

You can use `.env.example` file:

```
set -a
source .env.example
```

To provide `$GH_CLIENT_ID` and `$GH_SECRET` create Github OAuth App (https://github.com/settings/developers).

Set `Homepage URL` to match `$ROOT_URL`, and `Authorization callback URL` to match
`$ROOT_URL/_oauth/github`.

Start app:

```
docker-compose up --build
```
