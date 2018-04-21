import sys
import os
import argparse
import inspect


parser = argparse.ArgumentParser(description='Load a specified App, compile and host on localhost')
parser.add_argument(
    'scripts',
    type=str,
    help='"script1;script2;...;", all the arguments will be passed to each script',
)
parser.add_argument(
    'args', 
    type=str, 
    help='"arg1;arg2;...;"',
    nargs='?',
    default=''
)

args = parser.parse_args()

def get_components(string):
    '''
    assumes that components are ";" separated strings.
    extracts these components and returns a list of components.
    '''
    components = []
    for component in string.split(';'):
        if not component.isspace():
            components.append(component)
    return components

arguments = get_components(args.args)
scripts = get_components(args.scripts)

scripts_ = []
for script in scripts:
    script_ = ''
    for component in script.split(' '):
        component = component.strip()
        if component.startswith('%'):
            try:
                num_argument = int(component[1:]) - 1
                if not (num_argument >= len(arguments)):
                    script_ += ' ' + arguments[num_argument]
            except:
                script_ += ' ' + component
        else: script_ += ' ' + component
    scripts_.append(script_)

for script in scripts_:
    print(script)
    os.system(script)