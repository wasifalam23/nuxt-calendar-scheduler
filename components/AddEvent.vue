<script setup>
	import * as Realm from "realm-web";
	const emit = defineEmits(["addEvent"]);
	const modalIsOpen = useState("add-event-modal");

	const { bookingCol } = useRealmApp();

	const slots = [
		{ slot: "01:00 PM", duration: { start: "01:00 PM", end: "02:00 PM" } },
		{ slot: "02:00 PM", duration: { start: "02:00 PM", end: "03:00 PM" } },
		{ slot: "03:00 PM", duration: { start: "03:00 PM", end: "04:00 PM" } },
		{ slot: "04:00 PM", duration: { start: "04:00 PM", end: "05:00 PM" } },
		{ slot: "05:00 PM", duration: { start: "05:00 PM", end: "06:00 PM" } },
		{ slot: "06:00 PM", duration: { start: "06:00 PM", end: "07:00 PM" } },
		{ slot: "07:00 PM", duration: { start: "07:00 PM", end: "08:00 PM" } },
		{ slot: "08:00 PM", duration: { start: "08:00 PM", end: "09:00 PM" } },
	];

	const timeSlots = ref(slots);

	const eventTitle = ref("");
	const scheduleDate = ref("");
	const slot = ref(null);
	const eventPeople = ref("");
	const eventDescription = ref("");

	const isSubmitting = ref(false);

	const fetchAvlSlots = ref(false);

	const getAvailableSlots = async (newPickedDate) => {
		fetchAvlSlots.value = true;
		try {
			const col = await bookingCol();
			const data = await col.find();

			const bookingsData = data.filter((booking) => {
				const bookingDate = new Date(booking.schedule_date);
				const pickedDate = new Date(newPickedDate);

				const bookingDateWithoutTime = new Date(
					bookingDate.getFullYear(),
					bookingDate.getMonth(),
					bookingDate.getDate()
				);

				const selectedDateWithoutTime = new Date(
					pickedDate.getFullYear(),
					pickedDate.getMonth(),
					pickedDate.getDate()
				);

				return (
					bookingDateWithoutTime.getTime() === selectedDateWithoutTime.getTime()
				);
			});

			const slotsToRemove = bookingsData.map((slot) => toAMPMTime(slot.start));

			if (slotsToRemove.length === 0) {
				timeSlots.value = slots;
			} else if (slotsToRemove.length > 0) {
				timeSlots.value = timeSlots.value.filter(
					(slot) => !slotsToRemove.includes(slot.slot)
				);
			}

			fetchAvlSlots.value = false;
		} catch (err) {
			console.log(err);
			fetchAvlSlots.value = true;
		}
	};

	watch(scheduleDate, async (newDate) => {
		getAvailableSlots(newDate);
		timeSlots.value = slots;
		slot.value = null;
	});

	const addEventHandler = async () => {
		isSubmitting.value = true;
		try {
			const uuid = Realm.BSON.ObjectID();

			const data = {
				_id: uuid,
				id: uuid.toString(),
				title: eventTitle.value,
				schedule_date: new Date(scheduleDate.value),
				start: `${scheduleDate.value} ${toRailwayTime(slot.value.start)}`,
				end: `${scheduleDate.value} ${toRailwayTime(slot.value.end)}`,
				description: eventDescription.value,
				people: eventPeople.value.split(",").map((people) => people.trim()),
			};

			const col = await bookingCol();
			const insertId = await col.insertOne(data);

			if (insertId) {
				emit("addEvent", data);

				eventTitle.value = "";
				scheduleDate.value = "";
				slot.value = null;
				eventPeople.value = "";
				eventDescription.value = "";
				modalIsOpen.value = false;
			}

			isSubmitting.value = false;
		} catch (err) {
			console.error(err);
			isSubmitting.value = false;
		}
	};

	const menuStyle = {
		padding: {
			sm: "py-[.7rem]",
		},

		color: {
			white: {
				outline:
					"shadow-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary-400 placeholder:text-gray-500",
			},
		},
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
								for="schedule-date"
								class="block mb-1.5 text-sm font-medium text-gray-900"
								>Schedule date</label
							>
							<input
								v-model="scheduleDate"
								type="date"
								name="start"
								id="schedule-date"
								class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
								required />
						</div>
						<div class="">
							<label
								for="end"
								class="block mb-1.5 text-sm font-medium text-gray-900"
								>Available Time Slot</label
							>
							<UInputMenu
								:ui="menuStyle"
								v-model="slot"
								:options="timeSlots"
								value-attribute="duration"
								option-attribute="slot"
								:loading="fetchAvlSlots"
								:disabled="fetchAvlSlots"
								:placeholder="
									fetchAvlSlots
										? 'Checking available slots...'
										: 'Select a slot'
								"
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
