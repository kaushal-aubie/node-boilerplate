#!/bin/sh
# Kill process(es) listening on port 8000. No-op (exit 0) if none.
pids=$(lsof -ti:8000 2>/dev/null)
[ -z "$pids" ] || kill $pids
