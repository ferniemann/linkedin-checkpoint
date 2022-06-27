const list = document.querySelector("#list");
const counter = document.querySelector("#counter");

let count = localStorage.getItem("count") || 0;

const url = "https://dummy-apis.netlify.app/api/contact-suggestions?count=";

const profiles = [];

loadProfiles(8, 0);
renderCounter();

function loadProfiles(profileCount, start) {
    fetch(url + profileCount)
        .then((res) => res.json())
        .then((data) =>
            data.forEach((obj) => {
                obj.id =
                    obj.name.first.toLowerCase().replaceAll(" ", "") +
                    obj.name.last.toLowerCase().replaceAll(" ", "");
                profiles.push(obj);
            })
        )
        .then(() => renderProfiles(start));
}

function renderProfiles(start) {
    for (let i = start; i < profiles.length; i++) {
        const profile = profiles[i];

        const liEl = document.createElement("li");

        const text = document.createElement("p");
        text.innerText = profile.name.first + " " + profile.name.last;

        const btnConnect = document.createElement("button");
        btnConnect.innerText = "Connect";
        btnConnect.addEventListener("click", toggleConnect);

        const btnDelete = document.createElement("button");
        btnDelete.innerText = "X";
        btnDelete.id = profile.id;
        btnDelete.addEventListener("click", deleteProfile);

        liEl.append(text, btnConnect, btnDelete);
        list.append(liEl);
    }
}

function toggleConnect() {
    if (this.innerText === "Connect") {
        this.innerText = "Pending";
        count++;
        localStorage.setItem("count", count);
        renderCounter();
    } else {
        this.innerText = "Connect";
        count--;
        localStorage.setItem("count", count);
        renderCounter();
    }
}

function renderCounter() {
    counter.innerText = count;
}

function deleteProfile() {
    const card = this.parentElement;
    const id = this.id;
    const index = profiles.findIndex((profile) => profile.id === id);
    profiles.splice(index, 1);

    card.remove();

    loadProfiles(1, 7);
}
