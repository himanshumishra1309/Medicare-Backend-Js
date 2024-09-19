class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message) // super call is used to overwrite things
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}


{/*

    Class Declaration: class ApiError extends Error
    class: In JavaScript, a class is a blueprint for creating objects. Classes encapsulate data (properties) and methods that operate on that data. They offer a cleaner and more structured way to implement object-oriented programming (OOP).

    extends Error: The extends keyword is used for class inheritance. In this case, ApiError inherits from the built-in Error class, meaning it gets all the properties and methods of Error, but can also define its own.

    Inheritance: In JavaScript, a class can inherit methods and properties from another class using extends. This allows for creating specialized classes based on a more general one. In this example, ApiError is a specialized version of Error.

*/}

{/*

    Calling super(message)
    super(message): The super() function is used to call the constructor of the parent class (Error in this case). It passes the message parameter to the Error class’s constructor.
    Why call super()?: In JavaScript, when a class extends another class, you must call super() in the derived class’s constructor before you can use this. This is required to set up the inheritance chain properly.
    By calling super(message), the ApiError class gets access to the built-in behavior of the Error class, such as setting the message property automatically.

*/}

{/*

    Yes, in JavaScript, there is a **built-in** class called `Error`. The `Error` class is not self-defined by the user but is part of the standard JavaScript language. It is designed to represent errors in the execution of programs. You are extending this built-in class in your code to create a custom error class (`ApiError`) with additional functionality.

    Built-in `Error` Class in JavaScript:

    The `Error` class in JavaScript is used to generate error objects that capture information about exceptions that occur during the execution of code. This class comes with several useful properties and methods, including:
    --> `message`: A string that contains the error message.
    --> `name`: The name of the error type (e.g., `"Error"` by default).
    --> `stack`: A stack trace string that shows where the error occurred in the code, useful for debugging.

    You can create a simple error using this built-in class like this:

    js:
    const error = new Error("Something went wrong!");
    console.log(error.message);  // Output: "Something went wrong!"
    console.log(error.stack);    // Output: Stack trace with line number where the error occurred
    

    Extending the Built-in `Error` Class:

    When you extend the `Error` class, like in your `ApiError` class, you're leveraging the core functionality of JavaScript's error-handling mechanism while adding your own custom logic and properties.

    Here’s what happens when you extend the `Error` class:

    js:
    class ApiError extends Error {
        constructor(statusCode, message, errors) {
            super(message);  // Calls the parent `Error` class constructor with the message
            this.statusCode = statusCode;
            this.errors = errors;
        }
    }
    

    --> `super(message)`: The `super` call invokes the constructor of the parent class (`Error`), passing the `message` to it. This ensures that the custom error still has all the properties of the built-in `Error` class, such as `message` and `stack`.
    
    --> By extending `Error`, the custom `ApiError` class gets its own unique structure (with `statusCode`, `errors`, etc.) while still behaving like a standard error object.

    Why Extend the Built-in `Error` Class?
    You extend the `Error` class to create custom error objects that include additional information, such as HTTP status codes, error details, or custom messages. This is particularly useful for API development, where you need to standardize error responses and make debugging easier.

    Example of the Built-in `Error` Class:
    js:
    try {
        throw new Error("This is a built-in error");
    } catch (e) {
        console.log(e.name);    // Output: "Error"
        console.log(e.message); // Output: "This is a built-in error"
        console.log(e.stack);   // Output: The stack trace
    }
    
    So, when you write `class ApiError extends Error`, you are extending JavaScript's **native** `Error` class and enhancing it with additional properties (`statusCode`, `errors`, etc.) for your specific needs, such as API error handling.

*/}

{/*
   
    if(stack){
        this.stack = stack
    } else{
        Error.captureStackTrace(this, this.constructor)
    }

    This code is part of the ApiError class's constructor, and it handles the stack trace (i.e., the list of function calls that were active when the error occurred). A stack trace helps developers trace back the sequence of function calls that led to the error, making it easier to debug.

    If stack is truthy (i.e., not null, undefined, false, or an empty string), the code inside the if block will execute.



    Error.captureStackTrace(this, this.constructor):


    Error.captureStackTrace:
    This is a built-in method of the native Error class in JavaScript.
    It captures the current stack trace at the point where this method is called.
    The Error object keeps track of the sequence of function calls (the call stack) leading to an error, which helps in debugging.
    
    this:
    Refers to the current instance of the ApiError class being created.
    The stack trace will be associated with this specific instance.
    
    this.constructor:
    Refers to the constructor function of the current instance, which in this case is the ApiError class.
    By passing this.constructor as the second argument to captureStackTrace, the stack trace will exclude the constructor call itself. This way, the stack trace will start from where the error actually occurred (outside the ApiError class constructor).
    
*/}