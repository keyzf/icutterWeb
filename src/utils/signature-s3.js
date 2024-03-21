/* 目前没有引用*/

// export function f() {
//   let accessKeyId = ' ';
//   let secretAccessKey= ' ';
//   let region='us-east-1';
//   let serviceName='s3';
//   let algorithm = 'AWS4-HMAC-SHA256';
//   let v4Identifier = 'aws4_request';
// }
// // CanonicalHeaders
// function canonicalHeaderValues(values) {
//   return values.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
// }
// function canonicalHeaders(request) {
//   var headers = [];
//   for(var i in request.header)
//   {
//     headers.push([i, request.header[i]]);
//   }
//   headers.sort(function (a, b) {
//     return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
//   });
//
//   var parts = [];
//   for(var i in headers)
//   {
//     var key = headers[i][0].toLowerCase();
//     var value =  headers[i][1];
//     parts.push(key + ':' + canonicalHeaderValues(value.toString()));
//   }
//   return parts.join('\n');
// }
