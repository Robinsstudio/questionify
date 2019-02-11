import React, { Component, Fragment } from 'react';
import PromptModal from './PromptModal';
import ConfirmModal from './ConfirmModal';
import QuestionModal from './QuestionModal';

class Modals extends Component {
	constructor(props) {
		super(props);
		this.state = {
			promptModal: {},
			confirmModal: {},
			questionModal: {
				data: {
					question: '',
					answers: [],
				}
			}
		};

		this.updatePromptModal = this.updatePromptModal.bind(this);
		this.hidePromptModal = this.hidePromptModal.bind(this);
		this.hideConfirmModal = this.hideConfirmModal.bind(this);
		this.updateQuestionModal = this.updateQuestionModal.bind(this);
		this.hideQuestionModal = this.hideQuestionModal.bind(this)
	}

	showPromptModal(title, placeholder, promise) {
		this.setState({ promptModal: { open: true, title, placeholder, value: '', promise } });
	}

	updatePromptModal(value) {
		this.setState((state) => {
			return { promptModal: { ...state.promptModal, value } };
		});
	}

	hidePromptModal() {
		this.setState((state) => {
			return { promptModal: { ...state.promptModal, open: false } };
		});
	}

	showConfirmModal(title, body, promise) {
		this.setState({ confirmModal: { open: true, title, body, promise } });
	}

	hideConfirmModal() {
		this.setState((state) => {
			return { confirmModal: { ...state.confirmModal, open: false } };
		});
	}

	showQuestionModal(data, promise) {
		const code = data.code || 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello world!");\n\t}\n}';
		this.setState({ questionModal: { open: true, data: { ...data, code, type: 'question' }, promise } });
	}

	updateQuestionModal(data) {
		this.setState((state) => {
			return { questionModal: { ...state.questionModal, data } };
		});
	}

	hideQuestionModal() {
		this.setState((state) => {
			return { questionModal: { ...state.questionModal, open: false } };
		});
	}

	render() {
		const { promptModal, confirmModal, questionModal } = this.state;
		return (
			<Fragment>
				<PromptModal
					open={promptModal.open} title={promptModal.title} placeholder={promptModal.placeholder} value={promptModal.value}
					update={this.updatePromptModal} hide={this.hidePromptModal} promise={promptModal.promise}
				/>

				<ConfirmModal
					open={confirmModal.open} title={confirmModal.title} body={confirmModal.body} hide={this.hideConfirmModal} promise={confirmModal.promise}
				/>

				<QuestionModal
					open={questionModal.open} data={questionModal.data} update={this.updateQuestionModal} 
					hide={this.hideQuestionModal} promise={questionModal.promise}
				/>
			</Fragment>
		);
	}
}

let component;
const modals = <Modals ref={(comp) => component = comp}/>

export default {
	get: () => modals,
	showPromptModal: (title, placeholder) => new Promise((resolve, reject) => component.showPromptModal(title, placeholder, { resolve, reject })),
	showConfirmModal: (title, body) => new Promise((resolve, reject) => component.showConfirmModal(title, body, { resolve, reject })),
	showQuestionModal: (data) => new Promise((resolve, reject) => component.showQuestionModal(data, { resolve, reject }))
}