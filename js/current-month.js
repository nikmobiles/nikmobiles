$(function() {
    Date.prototype.getMonthName = function() {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[this.getMonth()];
    }


    var now = new Date();
    if (now.getMonth() == 11) {
        var current = new Date(now.getFullYear() + 1, 0, 1).getMonthName();
    } else {
        var current = new Date(now.getFullYear(), now.getMonth() + 1, 1).getMonthName();
    }

    document.getElementById("monthz").innerHTML = current;
})
