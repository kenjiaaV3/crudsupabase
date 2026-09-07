const userForm = document.getElementById("userForm");
const namaInput = document.getElementById("nama");
const emailInput = document.getElementById("email");
const umurInput = document.getElementById("umur");

const userTable = document.getElementById("userTable");

const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

let editId = null;


// ==========================
// MENAMPILKAN DATA USERS
// ==========================

async function getUsers() {

    const response = await fetch("/api/users");

    const result = await response.json();

    userTable.innerHTML = "";

    result.data.forEach(user => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nama}</td>
            <td>${user.email}</td>
            <td>${user.umur}</td>

            <td>
                <button
                    class="edit"
                    onclick="editUser(${user.id}, '${user.nama}', '${user.email}', ${user.umur})"
                >
                    Edit
                </button>

                <button
                    class="delete"
                    onclick="deleteUser(${user.id})"
                >
                    Hapus
                </button>
            </td>
        `;

        userTable.appendChild(row);
    });
}


// ==========================
// TAMBAH / UPDATE USER
// ==========================

userForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const userData = {
        nama: namaInput.value,
        email: emailInput.value,
        umur: Number(umurInput.value)
    };

    let url = "/api/users";
    let method = "POST";

    if (editId !== null) {
        url = `/api/users/${editId}`;
        method = "PUT";
    }

    const response = await fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(userData)
    });

    const result = await response.json();

    alert(result.message);

    resetForm();

    getUsers();
});


// ==========================
// EDIT USER
// ==========================

function editUser(id, nama, email, umur) {

    editId = id;

    namaInput.value = nama;
    emailInput.value = email;
    umurInput.value = umur;

    formTitle.textContent = "Edit User";
    submitButton.textContent = "Update";
    cancelButton.style.display = "block";
}


// ==========================
// BATAL EDIT
// ==========================

cancelButton.addEventListener("click", function () {

    resetForm();

});


// ==========================
// RESET FORM
// ==========================

function resetForm() {

    editId = null;

    userForm.reset();

    formTitle.textContent = "Tambah User";
    submitButton.textContent = "Tambah";
    cancelButton.style.display = "none";
}


// ==========================
// DELETE USER
// ==========================

async function deleteUser(id) {

    const yakin = confirm("Yakin ingin menghapus user ini?");

    if (!yakin) {
        return;
    }

    const response = await fetch(`/api/users/${id}`, {

        method: "DELETE"

    });

    const result = await response.json();

    alert(result.message);

    getUsers();
}


getUsers();