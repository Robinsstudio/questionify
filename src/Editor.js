import React, { Component } from 'react';
import { Alert, Button } from 'reactstrap';
import Modals from './Modals';

class Editor extends Component {
	constructor(props) {
		super(props);

		this.save = this.save.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		this.handleDragOver = this.handleDragOver.bind(this);
		this.handleDragLeave = this.handleDragLeave.bind(this);
		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	removeQuestion(index) {
		const { editor, update } = this.props;
		update({ 
			...editor,
			questions: editor.questions.filter((quest, i) => i !== index)
		});
	}

	save() {
		const { editor, save } = this.props;
		if (editor.model.name) {
			save(editor.model.name);
		} else {
			Modals.showPromptModal('Nouveau QCM', 'Entrez un nom de QCM ici...').then(name => save(name)).catch(() => {});
		}
	}

	handleDrop(event) {
		const { editor, update } = this.props;
		const index = parseInt(event.target.dataset.index);
		
		if (event.dataTransfer.types.includes('question')) {
			const question = JSON.parse(event.dataTransfer.getData('question'));

			if (!editor.questions.some(quest => question._id === quest._id)) {
				update({
					...editor,
					questions: [...editor.questions.slice(0, index), question, ...editor.questions.slice(index)]
				});
			}

		} else if (event.dataTransfer.types.includes('srcindex')) {
			const questions = editor.questions.slice();
			const srcIndex = parseInt(event.dataTransfer.getData('srcindex'));
			const dstIndex = srcIndex < index ? index - 1 : index;

			questions.splice(dstIndex, 0, questions.splice(srcIndex, 1)[0]);
			update({ ...editor, questions });
		}
		event.target.classList.remove('dropZone');
	}

	handleDragOver(event) {
		if (event.dataTransfer.types.some(e => ['question', 'srcindex'].includes(e))) {
			event.target.classList.add('dropZone');
		}
		event.preventDefault();
	}

	handleDragLeave(event) {
		event.target.classList.remove('dropZone');
	}

	handleDragStart(event, index) {
		event.dataTransfer.setData('srcindex', index);
	}

	buildDropZone(index, stretch = '') {
		return <div data-index={index} className={`mt-2 mb-2 ml-3 mr-3 ${stretch} separator`} onDrop={this.handleDrop} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave}/>;
	}

	handleKeyPress = (event) =>{
		if(event.key === 'Enter'){
			window.alert('Key Down !');
			console.log('oooooooo');
		}
		if(event.key === 'a'){
			console.log('aaaaaaaaaaaaaaaaaaaaa');
		}
	}
	render() {
		const { editor, closeEditor } = this.props;
		return (
			<div id="editor" className={`view ${editor.visible ? 'editing' : ''}`} onKeyPress={this.handleKeyPress}>
				<div id="editorHeader" className="header">
					<span className="ml-3">Éditer un QCM</span>
					<div id="buttons" className="mr-3" >
						<Button color="primary" className="mr-2" onClick={this.save}>Enregistrer</Button>
						<Button color="secondary" className="mr-2" onClick={closeEditor}>Annuler</Button>
					</div>
				</div>

				<div id="questions" className="scrollable">
					{editor.questions.map((quest, index) => {
						return [
							this.buildDropZone(index),
							<Alert color="primary" className="ml-3 mr-3 mb-0" toggle={() => this.removeQuestion(index)} onDragStart={e => this.handleDragStart(e, index)} fade={false} draggable>{quest.name}</Alert>
						];
					}).concat(this.buildDropZone(editor.questions.length, 'stretch'))}
				</div>
			</div>
		);
	}
}

export default Editor;