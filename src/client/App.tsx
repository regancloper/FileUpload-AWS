import React from 'react';
import FileUpload from '../client/components/FileUpload';

interface AppProps {

}

export const App: React.FC<AppProps> = ({ }) => {
	return (
		<main className="container mt-4">
			<h4 className="display-4 text-center mb-4">React File Upload</h4>
			<FileUpload />
		</main>
	);
}



export default App;
