import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'
import Layout from './Layout';

const PackageDetail = ({packages}) => {

    const {packageType} = useParams();

    console.log(packageType);

    const k = {
        id: 4,
        name: 'Embrace Education',
        description: 'It\'s hard in every continent. Do your own on us.',
        img: ""
    }

    const [pkg, setPkg] = useState({
        id: 4,
        name: 'Embrace Education',
        description: 'It\'s hard in every continent. Do your own on us.',
        img: ""
    });
    const [numberOfDocs, setNumberOfDocs] = useState(1);

    useEffect(() => {
        console.log(packageType);
        console.log(pkg);
        console.log(packages);
        console.log(packages.filter(pkg => pkg.id == packageType))
        setPkg(packages.filter(pkg => pkg.id == packageType)[0]);
    }, [])

    console.log(pkg);
    

    return (
        <Layout children =
        {<div id="package-detail">
        <section id="detail-area">
            {!pkg ? <div>
                <img src={k.img} alt={`${k.name} pic`}/>
                <div>
                    <h1>
                        {k.name}
                    </h1>

                    <p>
                        {k.description}
                    </p>
                </div>
            </div>: <div>
                <img src={pkg.img} alt={`${pkg.name} pic`}/>
                <div class="pkg-description">
                    <h1>
                        {pkg.name}
                    </h1>

                    <p>
                        {pkg.description}
                    </p>
                </div>
            </div>}
        </section>
        <section id="package-enroll-area">

            <div>
                <h2>
                    Enroll for this package today
                </h2>
                <div class="register-form">
                    <div class="form-area">
                        <label>Enter Item Name</label>
                        <input type="text" name="item"/>
                    </div>
                    
                    <div class="form-area">
                        <label>Enter a unique identity info</label>
                        <input type="text" name="item"/>
                    </div>

                    <div class="form-area">
                        <label>
                            Upload an image of item
                        </label>
                        <input type="text" name="image"/>
                    </div>

                </div>
                <div class="register-form">
                        <h3>Documents</h3>
                        {
                            Array.from(Array(numberOfDocs)).map((ele, idx) => 
                                <div class= "doc-upload" key={idx}>
                                    <div class="doc-identity">
                                        <h3>Document</h3>
                                        <button onClick={() => setNumberOfDocs(prev => prev - 1)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                    

                                    <div class="form-area">
                                        <label>Enter file description</label>
                                        <input type="text" name="description"/>
                                    </div>
                                    
                                    <div class="form-area"> 
                                        <label>Upload file</label>
                                        <input type="file" name="image"/>
                                    </div>

                                    
                                </div>
                            )
                        }

                        <button style={{width: '300px'}} onClick= {() => setNumberOfDocs(prev => prev + 1)}>
                            Add another Document
                        </button>
                </div>

                <button style={{width: '400px', marginTop: '100px'}} onClick= {() => setNumberOfDocs(prev => prev + 1)}>
                    Register for package
                </button>
            </div>

        </section>
    </div>} />
        
    )

}


export default PackageDetail;