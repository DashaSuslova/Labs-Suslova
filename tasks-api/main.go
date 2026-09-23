package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx := context.Background()

	dsn := "postgres://postgres:12345678@localhost:5432/app?sslmode=disable"

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		log.Fatalf("cannot create pool: %v", err)
	}

	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("cannot reach database: %v", err)
	}

	h := &TaskHandler{
		store: NewTaskStore(pool),
	}

	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(
			w,
			http.StatusOK,
			map[string]string{"status": "ok"},
		)
	})

	mux.HandleFunc("GET /tasks", h.list)

	mux.HandleFunc("POST /tasks", h.create)

	mux.HandleFunc("GET /tasks/{id}", h.getOne)

	mux.HandleFunc("DELETE /tasks/{id}", h.remove)

	log.Println("server started on http://localhost:8080")

	srv := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
