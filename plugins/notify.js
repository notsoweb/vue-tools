import toastr from 'toastr';

class Notify {
  constructor() {}

  flash({message = 'Successful registration', type = 'success', timeout = 5, title= "Notificación"}) {

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeout * 1000,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    toastr[type](message, title);
  }

  success(message, title, timeout) {
    this.flash({
      message,
      title,
      timeout
    });
  }

  error(message, title, timeout) {
    this.flash({
      message, 
      type:'error',
      timeout,
      title
    });
  }
  
  info(message, title, timeout) {
    this.flash({
      message, 
      type:'info',
      timeout,
      title
    });
  }

  warning(message, title, timeout) {
    this.flash({
      message, 
      type:'warning',
      timeout,
      title
    });
  }
}

export default Notify;