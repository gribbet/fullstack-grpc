use std::{
    net::SocketAddr,
    sync::{Arc, Mutex},
};
use tonic::{transport::Server, Request, Response, Status};

use api::{
    user_service_server::{UserService, UserServiceServer},
    CreateUser, User,
};

pub mod api {
    tonic::include_proto!("api");
}

#[derive(Debug, Default)]
pub struct UserServiceImpl {
    users: Arc<Mutex<Vec<User>>>,
}

#[tonic::async_trait]
impl UserService for UserServiceImpl {
    async fn create(
        &self,
        request: Request<CreateUser>,
    ) -> Result<Response<User>, Status> {
        println!("Created");
        let users = self.users.clone();
        let mut users = users.lock().unwrap();
        let id = users.iter().map(|user| user.id).max().unwrap_or(0) + 1;
        let created = User {
            id: id,
            name: request.into_inner().name,
        };
        users.push(created.clone());
        Ok(Response::new(created))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr: SocketAddr = "0.0.0.0:50051".parse()?;
    let user_service = UserServiceImpl::default();

    println!("Starting at {}", addr);

    Server::builder()
        .add_service(UserServiceServer::new(user_service))
        .serve(addr)
        .await?;

    println!("Shutdown");

    Ok(())
}
