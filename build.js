({
    mainConfigFile:'js/src/main.js',
    name:'main',
    insertRequire:['main'],
    out:'build/js-compiled.js',
    removeCombined:true,
    findNestedDependencies:true,
    preserveLicenseComments:false,
    optimize:'uglify2'
})