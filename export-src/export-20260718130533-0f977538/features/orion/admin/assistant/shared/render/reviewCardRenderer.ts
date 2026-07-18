import type { OrionReviewCard } from '../../../../core/types';

function renderValue(value: string | string[]): HTMLElement {
	const wrapper = document.createElement('div');
	wrapper.className = 'orion-review-card__value';

	if (!Array.isArray(value)) {
		wrapper.textContent = value;
		return wrapper;
	}

	const list = document.createElement('ul');
	list.className = 'orion-review-card__items';
	for (const item of value) {
		const listItem = document.createElement('li');
		listItem.textContent = item;
		list.appendChild(listItem);
	}
	wrapper.appendChild(list);
	return wrapper;
}

export function renderOrionReviewCard(review: OrionReviewCard): HTMLElement {
	const card = document.createElement('div');
	card.className = 'orion-review-card';

	if (review.eyebrow) {
		const eyebrow = document.createElement('div');
		eyebrow.className = 'orion-review-card__eyebrow';
		eyebrow.textContent = review.eyebrow;
		card.appendChild(eyebrow);
	}

	const title = document.createElement('h3');
	title.className = 'orion-review-card__title';
	title.textContent = review.title;
	card.appendChild(title);

	if (review.description) {
		const descriptionCard = document.createElement('div');
		descriptionCard.className = 'orion-review-card__description-card';

		const description = document.createElement('p');
		description.className = 'orion-review-card__description';
		description.textContent = review.description;
		descriptionCard.appendChild(description);
		card.appendChild(descriptionCard);
	}

	for (const section of review.sections) {
		const sectionEl = document.createElement('section');
		sectionEl.className = 'orion-review-card__section';

		const heading = document.createElement('h4');
		heading.className = 'orion-review-card__section-title';
		heading.textContent = section.title;
		sectionEl.appendChild(heading);

		for (const row of section.rows) {
			const rowEl = document.createElement('div');
			rowEl.className = 'orion-review-card__row';

			if (row.label) {
				const label = document.createElement('div');
				label.className = 'orion-review-card__label';
				label.textContent = row.label;
				rowEl.appendChild(label);
			}
			rowEl.appendChild(renderValue(row.value));
			sectionEl.appendChild(rowEl);
		}

		card.appendChild(sectionEl);
	}

	return card;
}
