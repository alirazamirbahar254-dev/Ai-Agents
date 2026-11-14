
calculator_tool = {

    "type":"function",
    "function": {
        "name":"calculator",
        "description": "Use this tool for all arithmetic calculations. Always use it instead of calculating mentally. Pass the exact numbers and operator provided by the user without changing them.",

        "parameters":{
             "type":"object",
        "properties":{
            "a":{
                "type": "number"
            },

            "b":{
                "type": "number"
            },

        "options":{
            "type":"string",
            "enum":["+", "-", "*", "/", "//", "%", "**"]
        }
        },   

        "required":[
            "a", "b", "options"
        ]

        }
    }
    }

def calculator(a: int | float, b: int | float, options: str)-> int | float:
    if options in ("/", "//", "%") and b == 0:
        return "Cannot divide by zero"

    """Use this tool to calculate mathematical expressions. 
    Always use it for arithmetic calculations instead of calculating mentally.
    a, b, can be use integer and float values, and options is for string """

    if options == "-":
        return (a - b)
 
    elif options == "+":
        return (a + b)

    elif options == "*":
        return (a * b)
    
    elif options == "/":
        return (a / b)

    elif options == "//":
            return (a // b)

    elif options == "%":
            return (a % b)

    elif options == "**":
            return (a ** b)
    else:
          return "Invalid Oprater"

