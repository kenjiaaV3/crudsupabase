const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Koneksi Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// GET semua users
app.get("/api/users", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            return res.status(500).json({
                message: "Gagal mengambil data",
                error: error.message
            });
        }

        res.json({
            message: "Data users berhasil diambil",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan server"
        });
    }
});

// GET user berdasarkan ID
app.get("/api/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "ID harus berupa angka"
            });
        }

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            return res.status(404).json({
                message: "User tidak ditemukan",
                error: error.message
            });
        }

        res.json({
            message: "Data user ditemukan",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan server"
        });
    }
});

// POST tambah user
app.post("/api/users", async (req, res) => {
    try {
        const { nama, email, umur } = req.body;

        if (!nama || !email || umur === undefined) {
            return res.status(400).json({
                message: "Nama, email, dan umur wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("users")
            .insert([
                {
                    nama: nama,
                    email: email,
                    umur: umur
                }
            ])
            .select();

        if (error) {
            return res.status(500).json({
                message: "Gagal menambahkan user",
                error: error.message
            });
        }

        res.status(201).json({
            message: "User berhasil ditambahkan",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan server"
        });
    }
});

// PUT update user
app.put("/api/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nama, email, umur } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                message: "ID harus berupa angka"
            });
        }

        const { data, error } = await supabase
            .from("users")
            .update({
                nama: nama,
                email: email,
                umur: umur
            })
            .eq("id", id)
            .select();

        if (error) {
            return res.status(500).json({
                message: "Gagal mengubah user",
                error: error.message
            });
        }

        res.json({
            message: "User berhasil diubah",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan server"
        });
    }
});

// DELETE user
app.delete("/api/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "ID harus berupa angka"
            });
        }

        const { data, error } = await supabase
            .from("users")
            .delete()
            .eq("id", id)
            .select();

        if (error) {
            return res.status(500).json({
                message: "Gagal menghapus user",
                error: error.message
            });
        }

        res.json({
            message: "User berhasil dihapus",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan server"
        });
    }
});

module.exports.handler = serverless(app);