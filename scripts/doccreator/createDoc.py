#!/usr/bin/env python3
import markdown_generator as mg
from io import StringIO

heading_level = 3

class ArgumentDto:
    def __init__(self, arg_name, comments):
        self.name = arg_name
        self.comments = comments

class CommandDto:
    def __init__(self, command_name):
        self.command_name = command_name
        self.args = []
        self.comments = None

    def add_argument(self, name, comments):
        arg = ArgumentDto(name, comments)
        self.args.append(arg)

class Printer:
    def __init__(self, dto):
        self.dto = dto

    def comments_to_str(self, comments:str):
        return comments.replace('///', '')

    def print(self):
        with StringIO() as stream:
            writer = mg.Writer(stream)
            writer.write_heading(self.dto.command_name, heading_level)
            table = mg.Table()
            table.add_column('parameter name')
            table.add_column('description')
            for arg in self.dto.args:
                table.append(arg.name, self.comments_to_str(arg.comments))
            writer.write(table)
            writer.writeline()
            writer.writeline()
            #finito
            stream.seek(0)
            return stream.read()
    
    def __str__(self):
        return self.print()
    
    def __repr__(self):
        return str(self)

def processArgumentNames(file_str):
    import CppHeaderParser
    main_class = "ArgumentNames"
    cppHeader = CppHeaderParser.CppHeader(file_str)
    names = cppHeader.classes[main_class]
    command_dtos = []
    for command in names["properties"]["public"]:
        cmd_dto  = CommandDto(command['name'])
        command_class = cppHeader.classes[f"{main_class}::C{cmd_dto.command_name}"]
        command_dtos.append(cmd_dto)
        for argument in command_class["properties"]["public"]:
            comments = ""
            if 'doxygen' in argument:
                comments = argument['doxygen']
            arg_name = argument['default'].replace('"', '')
            cmd_dto.add_argument(arg_name, comments)
    return command_dtos
    

if __name__ == '__main__':
    import argparse
    #parser = argparse.ArgumentParser(description='generates markdown from argumentNames.h')
    #parser.add_argument('input', help='the input file')
    #args = parser.parse_args()
    #processArgumentNames(args.input)
    dtos = processArgumentNames('/home/samba/workspace/werckmeister/src/compiler/argumentNames.h')
    for dto in dtos:
        print(Printer(dto))