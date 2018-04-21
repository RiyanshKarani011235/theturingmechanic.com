import sys
import os
import argparse
import inspect

ROOT = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe()))) # script directory

parser = argparse.ArgumentParser(description='Load a specified App, compile and host on localhost')
parser.add_argument(
    'app_name', 
    type=str, 
    help='name of the app to load. For example, if the name of the app is "foo", ' + 
    'the script will load the app from App.foo.tsx. (default: App.tsx)',
    nargs='?',
    default=''
)

parser.add_argument(
    'dir',
    type=str,
    help='name of the directory (relative to the root folder), where the script ' +
    'will look for the App file',
    nargs='?',
    default='src'
)
args = parser.parse_args()

SRC_DIR = os.path.join(ROOT, args.dir)
app_file = 'App' # default
if args.app_name != '': app_file = 'App.' + args.app_name

if not os.path.exists(os.path.join(SRC_DIR, app_file + '.tsx')):
    print(app_file + '.tsx does not exist.')
    raise SystemExit(1)

index_file = os.path.join(SRC_DIR, 'index.tsx')
lines = None
with open(index_file, 'r+') as f:
    lines = f.readlines()

line_added = False
with open (index_file, 'w') as f:
    for line in lines:
        if 'import App from \'./App' in line:
            f.write('import App from \'./' + app_file + '\';\n')
            line_added = True
        else:
            f.write(line)

if not line_added:
    print('index.tsx not modified.')
    raise SystemExit(1)

print('index.tsx modified successfully!')