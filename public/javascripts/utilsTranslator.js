// $(() => {
//     $navLinks = $('#navbar .nav-link');
//     names = [];
//     $navLinks.hide()
//     $navLinks.each((index, item) => {
//         names.push($(item).text());
//     })
//     $.post("/utilsTranslator", {names},
//         function (data) {
//             $navLinks.each((index, item) => {
//                 $(item).text(data[index]);
//             })
//             $navLinks.show()
//         }
//     );
    
// })