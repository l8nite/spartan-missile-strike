function MAError(message) {
    this.message = message;
    // Log this error
    // TODO
}

MAError.prototype = Error.prototype;
MAError.prototype.name = "MAError";