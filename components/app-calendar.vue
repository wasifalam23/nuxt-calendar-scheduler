<script setup>
	import { ref } from "vue";
	import { ScheduleXCalendar } from "@schedule-x/vue";
	import {
		createCalendar,
		viewDay,
		viewWeek,
		viewMonthGrid,
		viewMonthAgenda,
	} from "@schedule-x/calendar";
	import "@schedule-x/theme-default/dist/index.css";
	import { createResizePlugin } from "@schedule-x/resize";
	import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
	import { createEventModalPlugin } from "@schedule-x/event-modal";
	import { onMounted } from "vue";
	import { initFlowbite } from "flowbite";
	import { PlusIcon, XMarkIcon } from "@heroicons/vue/24/solid";

	const modalIsOpen = ref(false);

	const { getAllBookings } = useRealmApp();

	const calendarApp = createCalendar({
		selectedDate: "2024-03-19",
		views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
		defaultView: viewWeek.name,
		plugins: [
			createResizePlugin(),
			createDragAndDropPlugin(),
			createEventModalPlugin(),
		],
		events: [
			{
				id: 1,
				title: "Event 1",
				start: "2024-03-19 13:00",
				end: "2024-03-19 15:00",
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text",
				location: "Delli, India",
			},
		],
		calendars: {
			work: {
				colorName: "work",
				lightColors: {
					container: "#fff",
					onContainer: "#000",
					main: "#fff",
				},
				darkColors: {
					container: "#000",
					onContainer: "#fff",
					main: "#000",
				},
			},
		},
	});

	onMounted(() => {
		initFlowbite();

		getAllBookings()
			.then((events) => {
				calendarApp.events.set(events);
			})
			.catch((err) => console.log(err));
	});

	const eventTitle = ref("");
	const eventStart = ref("");
	const eventEnd = ref("");
	const eventDescription = ref("");
	const eventLocation = ref("");
	const eventId = ref(calendarApp.events.getAll().length);

	const addEvent = () => {
		let data = {
			id: eventId.value + 1,
			title: eventTitle.value,
			start: eventStart.value,
			end: eventEnd.value,
			description: eventDescription.value,
			location: eventLocation.value,
		};
		console.log(data);
		calendarApp.events.add(data);
		console.log(calendarApp.events.getAll());
		eventTitle.value = "";
		eventStart.value = "";
		eventEnd.value = "";
		eventDescription.value = "";
		eventLocation.value = "";
		eventId.value = calendarApp.events.getAll().length;
	};

	const deleteEvent = (id) => {
		calendarApp.events.remove(id);
	};

	const updateEvent = (id, updatedEvent) => {
		calendarApp.events.update(id, updatedEvent);
	};
</script>

<template>
	<div class="h-full overflow-hidden mt-4">
		<button
			@click="modalIsOpen = true"
			class="w-full bg-gray-200 flex items-center gap-1 justify-center text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg py-3 mb-2 text-center cursor-pointer"
			type="button">
			<PlusIcon class="w-5 h-5" />
			<span> Add Event </span>
		</button>
		<ClientOnly>
			<ScheduleXCalendar :calendar-app="calendarApp" />
		</ClientOnly>

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

				<form class="px-2 pt-1">
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
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder:text-gray-500"
								placeholder="Type a title"
								required="" />
						</div>
						<div class="">
							<label
								for="location"
								class="block mb-1.5 text-sm font-medium text-gray-900"
								>Location</label
							>
							<input
								v-model="eventLocation"
								type="text"
								name="location"
								id="location"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder:text-gray-500"
								placeholder="Type your location"
								required="" />
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
									class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5"
									placeholder="$2999"
									required="" />
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
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
									placeholder="$2999"
									required="" />
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
								placeholder="Write product description here" />
						</div>
						<button
							@click="addEvent"
							type="button"
							class="text-white inline-flex items-center mt-4 ml-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center">
							Submit
						</button>
					</div>
				</form>
			</UCard>
		</UModal>
	</div>
</template>

<style>
	.sx-vue-calendar-wrapper {
		height: 700px;
		max-height: 90vh;
		width: 100%;
	}
</style>
