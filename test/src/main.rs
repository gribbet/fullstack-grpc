use api::{user_service_client::UserServiceClient, CreateUser};

pub mod api {
    tonic::include_proto!("api");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut user_service =
        UserServiceClient::connect("http://localhost:50051").await?;

    let request = tonic::Request::new(CreateUser {
        name: "Tonic".into(),
    });

    let response = user_service.create(request).await?;

    println!("RESPONSE={:?}", response);

    Ok(())
}
