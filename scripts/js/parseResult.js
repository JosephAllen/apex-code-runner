parseResult(result) {
    let userDebug = '';
    if (result.compiled === 'true' && result.success === 'true') {
        userDebug = this.parseDebug(result.debugLog);
    }
    if (result.compiled === 'true' && result.success === 'false') {
        userDebug = 'FATAL_ERROR\n' + result.exceptionMessage + '\n' + result.exceptionStackTrace;
    }
    if (result.compiled !== 'true') {
        userDebug = 'Compile error at line ';
        userDebug += result.line + ' column ' + result.column;
        userDebug += '\n' + result.compileProblem;
        //txtResult = strBuilder.str;
    }
    if (userDebug.startsWith('\n')) {
        userDebug = userDebug.substring(1);
    }
    this.userDebug = userDebug;
}
parseDebug(debugLog) {
    let userDebug = '';
    if (debugLog.includes('DEBUG')) {
        let debugElements = debugLog.split('|');
        debugElements.forEach((element, index) => {
            if (element.includes('USER_DEBUG')) {
                let debugData = debugElements[index + 3];
                userDebug += '\n' + debugData.substring(0, debugData.lastIndexOf('\n'));
            }
        });
    }
    if (userDebug === '') {
        userDebug = 'Anonymous execution was successful.';
    }
    return userDebug;
}