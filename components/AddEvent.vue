<script setup>
	import * as Realm from "realm-web";
	const emit = defineEmits(["addEvent"]);
	const modalIsOpen = useState("add-event-modal");

	const { bookingCol } = useRealmApp();

	const isSubmitting = ref(false);

	const eventTitle = ref("");
	const eventStart = ref("");
	const eventEnd = ref("");
	const eventPeople = ref("");
	const eventDescription = ref("");

	const addEventHandler = async () => {
		isSubmitting.value = true;
		try {
			const uuid = Realm.BSON.ObjectID();

			const data = {
				_id: uuid,
				id: uuid.toString(),
				title: eventTitle.value,
				schedule_date: new Date(eventStart.value),
				start: toEventDateTime(eventStart.value),
				end: toEventDateTime(eventEnd.value),
				description: eventDescription.value,
				time_slot_start: getOnlyTime(eventStart.value),
				time_slot_end: getOnlyTime(eventEnd.value),
				people: eventPeople.value.split(",").map((people) => people.trim()),
			};

			const col = await bookingCol();
			const insertId = await col.insertOne(data);

			if (insertId) {
				emit("addEvent", data);
				modalIsOpen.value = false;
			}
			isSubmitting.value = false;
		} catch (err) {
			console.error(err);
			isSubmitting.value = false;
		}
	};
</script>

<template>
	<UModal v-model="modalIsOpen">
		<UCard
			:ui="{
				ring: '',
				divide: 'divide-y divide-gray-100 ',
			}">
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="text-base font-semibold leading-6 text-gray-900">
						Add New Event
					</h3>
					<UButton
						color="gray"
						variant="ghost"
						icon="i-heroicons-x-mark-20-solid"
						class="-my-1"
						@click="modalIsOpen = false" />
				</div>
			</template>

			<form @submit.prevent="addEventHandler" class="px-2 pt-1">
				<div class="flex flex-col gap-4">
					<div class="">
						<label
							for="title"
							class="block mb-1.5 text-sm font-medium text-gray-900"
							>Event Title</label
						>
						<input
							v-model="eventTitle"
							type="text"
							name="title"
							id="title"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-500"
							placeholder="Type a title"
							required />
					</div>
					<div class="">
						<label
							for="people"
							class="block mb-1.5 text-sm font-medium text-gray-900"
							>People</label
						>
						<input
							v-model="eventPeople"
							type="text"
							id="people"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-500"
							placeholder="Names (separated by commas if multiple)"
							required />
					</div>
					<div class="flex justify-between max-sm:flex-col">
						<div class="">
							<label
								for="start"
								class="block mb-1.5 text-sm font-medium text-gray-900"
								>Start</label
							>
							<input
								v-model="eventStart"
								type="datetime-local"
								name="start"
								id="start"
								class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
								placeholder="$2999"
								required />
						</div>
						<div class="">
							<label
								for="end"
								class="block mb-1.5 text-sm font-medium text-gray-900"
								>End</label
							>
							<input
								v-model="eventEnd"
								type="datetime-local"
								name="end"
								id="end"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								placeholder="$2999"
								required />
						</div>
					</div>

					<div class="">
						<label
							for="description"
							class="block mb-1.5 text-sm font-medium text-gray-900"
							>Description</label
						>
						<textarea
							v-model="eventDescription"
							id="description"
							rows="4"
							class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500"
							placeholder="Write a description"
							required />
					</div>
					<button
						@click="addEvent"
						type="submit"
						:class="
							isSubmitting
								? 'text-gray-50 bg-gray-400 border border-gray-300'
								: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 focus:ring-4 focus:outline-none'
						"
						class="flex items-center gap-1 justify-center mt-4 ml-auto font-medium rounded-lg text-sm px-5 py-2 text-center">
						<Spinner v-if="isSubmitting" class="-mt-0.5" size="small" />
						<span v-if="!isSubmitting"> Submit </span>
						<span v-if="isSubmitting"> Please wait </span>
					</button>
				</div>
			</form>
		</UCard>
	</UModal>
</template>
