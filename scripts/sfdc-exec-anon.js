const fetch = require('node-fetch');
const {
    Org,
    AuthInfo
} = require('@salesforce/core');

let source = "System.debug(\'Hello World!\');";
//let source = "System.debug(Page.SessionId.getContent().toString());"
execAnon(source);

async function execAnon(source) {
    const org = await Org.create({});
    const username = org.getUsername();
    const authInfo = await AuthInfo.create({
        username: username
    });
    const accessToken = authInfo.getConnectionOptions().accessToken;
    const instanceUrl = authInfo.getConnectionOptions().instanceUrl;
    let env = {
        'soap:Envelope': {
            $: {
                "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
                "xmlns": "http://soap.sforce.com/2006/08/apex"
            },
            'soap:Header': {
                DebuggingHeader: {
                    categories: [{
                        category: 'Apex_code',
                        level: 'Debug'
                    }]
                },
                SessionHeader: {
                    sessionId: accessToken
                }
            },
            'soap:Body': {
                executeAnonymous: {
                    String: source
                }
            }
        }
    };
    let xml2js = require('xml2js');

    let builder = new xml2js.Builder();
    let requestBody = builder.buildObject(env);

    fetch(instanceUrl + '/services/Soap/s/47.0', {
            method: 'post',
            body: requestBody,
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'SOAPAction': '""'
            },
        })
        .then(res => res.text())
        .then(response => {
            parse(response);
        });
}

function parse(xml) {
    var parseString = require('xml2js').parseString;
    var stripNS = require('xml2js').processors.stripPrefix;
    let parseOptions = {
        emptyTag: null,
        explicitArray: false,
        ignoreAttrs: true,
        normalizeTags: false,
        tagNameProcessors: [stripNS]
    };

    parseString(xml, parseOptions, function (err, result) {
        const response = Object.assign(result.Envelope.Header.DebuggingInfo, result.Envelope.Body.executeAnonymousResponse.result);
        //console.log(JSON.stringify(response, null, 2));
        console.log(response.debugLog);
    });
}