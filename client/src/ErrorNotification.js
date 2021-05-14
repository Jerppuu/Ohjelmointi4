import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

function ErrorNotification() {
		store.addNotification({
			title: 'Meidän Virhe!',
			message: 'Sovelluksesi havaitsi virheen järjestelmässämme. Kokeile hetken päästä uudestaan',
			type: 'warning',                         // 'default', 'success', 'info', 'warning'
			container: 'bottom-right',                // where to position the notifications
			animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
			animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
			dismiss: {
				duration: 5000
			}
		});
		return (<div/>);
}

export default ErrorNotification;